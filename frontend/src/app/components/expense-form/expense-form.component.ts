import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense, ExpenseRequest } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
})
export class ExpenseFormComponent implements OnChanges, OnDestroy {
  @Input() expense: Expense | null = null;
  @Output() save = new EventEmitter<ExpenseRequest>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
  quickAmounts = [50, 100, 200, 500, 1000];

  smartInput = '';
  liveTranscript = '';
  interimText = '';
  transcript = '';
  isListening = false;
  parsedHint = '';
  speechSupported = false;

  private recognition: any = null;
  private finalTranscript = '';

  private monthNames: Record<string, number> = {
    'january': 0, 'jan': 0, 'february': 1, 'feb': 1, 'march': 2, 'mar': 2,
    'april': 3, 'apr': 3, 'may': 4, 'june': 5, 'jun': 5, 'july': 6, 'jul': 6,
    'august': 7, 'aug': 7, 'september': 8, 'sep': 8, 'sept': 8,
    'october': 9, 'oct': 9, 'november': 10, 'nov': 10, 'december': 11, 'dec': 11
  };

  private categoryKeywords: Record<string, string[]> = {
    'Food': ['food', 'lunch', 'dinner', 'breakfast', 'coffee', 'tea', 'snack', 'meal', 'restaurant', 'cafe', 'grocery', 'groceries', 'bakery', 'fruit', 'water', 'juice', 'milk', 'rice', 'bread', 'chicken', 'fish', 'meat', 'pizza', 'burger', 'biryani'],
    'Transport': ['transport', 'bus', 'train', 'taxi', 'uber', 'cng', 'auto', 'rickshaw', 'fuel', 'petrol', 'diesel', 'metro', 'flight', 'airline', 'parking', 'toll'],
    'Shopping': ['shopping', 'shop', 'bought', 'bought', 'clothes', 'clothing', 'shoes', 'shirt', 'pants', 'dress', 'market', 'mall', 'online', 'amazon', 'aliexpress'],
    'Bills': ['bill', 'bills', 'electricity', 'electric', 'water bill', 'gas', 'internet', 'wifi', 'phone', 'mobile', 'recharge', 'sim', 'broadband', 'cable'],
    'Health': ['health', 'doctor', 'hospital', 'medicine', 'pharmacy', 'clinic', 'dentist', 'eye', 'checkup', 'lab', 'test', 'insurance', 'gym', 'vitamin'],
    'Entertainment': ['entertainment', 'movie', 'cinema', 'game', 'gaming', 'netflix', 'spotify', 'youtube', 'music', 'concert', 'sport', 'cricket', 'football', 'book', 'magazine']
  };

  constructor(private fb: FormBuilder, private zone: NgZone) {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(200)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      category: ['Food', Validators.required],
      expenseDate: [this.todayString(), Validators.required],
      favorite: [false],
      recurring: [false],
      notes: ['']
    });

    this.initSpeechRecognition();
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  private initSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.speechSupported = true;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      this.zone.run(() => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            this.finalTranscript += result[0].transcript + ' ';
          } else {
            interim += result[0].transcript;
          }
        }

        this.liveTranscript = this.finalTranscript.trim();
        this.interimText = interim;
        this.smartInput = this.liveTranscript;
        this.parseSmartInput();

        //console.log('[Voice] Final so far:', this.finalTranscript.trim());
        if (interim) console.log('[Voice] Interim:', interim);
      });
    };

    this.recognition.onerror = (event: any) => {
      this.zone.run(() => {
        console.error('[Voice] Error:', event.error);
        if (event.error !== 'no-speech') {
          this.isListening = false;
        }
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
          }
        }
      });
    };
  }

  stopVoice(): void {
    if (this.isListening && this.recognition) {
      this.isListening = false;
      this.recognition.stop();
      this.transcript = this.finalTranscript.trim();
      this.interimText = '';
    }
  }

  onFieldFocus(): void {
    this.stopVoice();
  }

  toggleVoice(): void {
    if (!this.recognition) return;

    if (this.isListening) {
      this.stopVoice();
    } else {
      this.finalTranscript = this.smartInput ? this.smartInput + ' ' : '';
      this.transcript = '';
      this.interimText = '';
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (e) {
        console.error('[Voice] Could not start:', e);
      }
    }
  }

  onSmartInputChange(): void {
    this.finalTranscript = this.smartInput;
    this.parseSmartInput();
  }

  onSmartInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.parseSmartInput();
    }
  }

  parseSmartInput(): void {
    const input = this.smartInput.trim().toLowerCase();
    if (!input) {
      this.parsedHint = '';
      return;
    }

    const amount = this.extractAmount(input);
    const category = this.extractCategory(input);
    const date = this.extractDate(input);
    const description = this.extractDescription(input);

    //console.log('[Parse] Input:', input);
    //console.log('[Parse] Result:', { amount, category, date, description });

    let hint = '';
    if (amount) hint += `Amount: ৳${amount}`;
    if (category) hint += `${hint ? ' · ' : ''}Category: ${category}`;
    if (date) hint += `${hint ? ' · ' : ''}Date: ${date}`;
    if (description) hint += `${hint ? ' · ' : ''}"${description}"`;
    this.parsedHint = hint;

    if (amount) this.form.patchValue({ amount });
    if (category) this.form.patchValue({ category });
    if (date) this.form.patchValue({ expenseDate: date });
    if (description) this.form.patchValue({ description });
  }

  private extractAmount(text: string): number | null {
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(?:taka|tk|৳|bdt|bucked?)/i,
      /(?:৳|tk|bdt)\s*(\d+(?:\.\d+)?)/i,
      /(?:spent?|paid?|cost|price|amount)\s*(?:of|:)?\s*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const val = parseFloat(match[1]);
        if (val > 0 && val < 10000000) return val;
      }
    }
    return null;
  }

  private extractCategory(text: string): string | null {
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'i');
        if (regex.test(text)) {
          return category;
        }
      }
    }
    return null;
  }

  private extractDate(text: string): string | null {
    const months = this.monthNames;

    // "19 sept 2026", "19 september 2026", "19 sep 2026"
    let match = text.match(/(\d{1,2})\s+(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+(\d{4})/i);
    if (match) {
      return this.formatDate(match[1], match[2], match[3]);
    }

    // "19 sept", "19 september" (no year → current year)
    match = text.match(/(\d{1,2})\s+(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)(?:\s|$|[^0-9])/i);
    if (match) {
      return this.formatDate(match[1], match[2], String(new Date().getFullYear()));
    }

    // "sept 19", "september 19 2026"
    match = text.match(/(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+(\d{1,2})(?:\s+(\d{4}))?/i);
    if (match) {
      return this.formatDate(match[2], match[1], match[3] || String(new Date().getFullYear()));
    }

    // "today", "yesterday"
    if (/\b(today|tonight)\b/i.test(text)) {
      return this.formatDateObj(new Date());
    }
    if (/\b(yesterday)\b/i.test(text)) {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return this.formatDateObj(d);
    }

    // "19/09/2026" or "19-09-2026"
    match = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }

    return null;
  }

  private formatDate(dayStr: string, monthStr: string, yearStr: string): string | null {
    const day = parseInt(dayStr, 10);
    const month = this.monthNames[monthStr.toLowerCase()];
    const year = parseInt(yearStr, 10);
    if (day >= 1 && day <= 31 && month !== undefined && !isNaN(year)) {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
    return null;
  }

  private formatDateObj(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private extractDescription(text: string): string | null {
    let cleaned = text;

    // Strip dates
    cleaned = cleaned.replace(/\d{1,2}\s+(?:january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)(?:\s+\d{4})?/gi, '');
    cleaned = cleaned.replace(/(?:january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+\d{1,2}(?:\s+\d{4})?/gi, '');
    cleaned = cleaned.replace(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/g, '');
    cleaned = cleaned.replace(/\b(today|yesterday|tonight)\b/gi, '');

    // Strip amounts
    cleaned = cleaned.replace(/\d+(?:\.\d+)?\s*(?:taka|tk|৳|bdt|bucked?)/gi, '');
    cleaned = cleaned.replace(/(?:৳|tk|bdt)\s*\d+(?:\.\d+)?/gi, '');
    cleaned = cleaned.replace(/(?:spent?|paid?|cost|price|amount)\s*(?:of|:)?\s*\d+(?:\.\d+)?/gi, '');
    cleaned = cleaned.replace(/\d+(?:\.\d+)?/g, '');

    // Extract place names: "at northend", "at Mr diy", "from shopname"
    const placeMatch = cleaned.match(/\b(?:at|from|in|near|to)\s+([A-Za-z][\w\s]{1,30})/i);
    const place = placeMatch ? placeMatch[1].trim() : null;

    // Strip generic category labels (NOT specific items)
    const genericCategoryLabels = ['food', 'transport', 'shopping', 'bills', 'health', 'entertainment'];
    for (const label of genericCategoryLabels) {
      cleaned = cleaned.replace(new RegExp(`\\b${label}\\b`, 'gi'), '');
    }

    // Strip filler verbs and stop words
    cleaned = cleaned.replace(/\b(?:i|my|me|we|us|have|has|had|went|go|goes|eat|ate|eats|drink|drank|drinks|ordered|buy|bought|got|get|take|took|take|took|spent|paid|was|were|is|are|been|being|did|do|does|for|on|at|to|from|the|a|an|and|or|of|in|near|with|that|this|just|some|some|some|went to|gone to|eat at|drink at|eat from|drink from)\b/gi, '');
    cleaned = cleaned.replace(/[^\w\s]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // If we have a place, prefer it. Otherwise use remaining words.
    let result = cleaned;
    if (place) {
      const placeClean = place.replace(/[^\w\s]/g, '').trim();
      if (placeClean.length >= 2) {
        result = placeClean;
      }
    }

    if (result.length < 2) return null;
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expense']) {
      if (this.expense) {
        this.form.patchValue({
          description: this.expense.description,
          amount: this.expense.amount,
          category: this.expense.category,
          expenseDate: this.expense.expenseDate,
          favorite: this.expense.favorite || false,
          recurring: this.expense.recurring || false,
          notes: this.expense.notes || ''
        });
      } else {
        this.resetForm();
      }
    }
  }

  get isEditing(): boolean {
    return !!this.expense?.id;
  }

  setQuickAmount(amount: number): void {
    this.form.patchValue({ amount });
    this.form.get('amount')?.markAsTouched();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.value as ExpenseRequest);
    if (!this.isEditing) {
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm(): void {
    this.form.reset({
      description: '',
      amount: null,
      category: 'Food',
      expenseDate: this.todayString(),
      favorite: false,
      recurring: false,
      notes: ''
    });
    this.smartInput = '';
    this.parsedHint = '';
    this.liveTranscript = '';
    this.interimText = '';
    this.transcript = '';
    this.finalTranscript = '';
  }

  private todayString(): string {
    return this.formatDateObj(new Date());
  }
}
