import {
  CellFormatter,
  CellFormatterFactory,
  Value,
} from 'fittable-core/model';

export class FitCellDateFormatter implements CellFormatter {
  private dot = `(\\.|-|\\/)`;
  private day = `(d){1,2}`;
  private month = `(M){1,2}`;
  private year = `(y){1,4}`;
  private date = `((${this.day}${this.dot}${this.month}${this.dot}${this.year})|(${this.month}${this.dot}${this.day}${this.dot}${this.year})|(${this.year}${this.dot}${this.month}${this.dot}${this.day}))`;
  private hour = `(h){1,2}`;
  private min = `(m){1,2}`;
  private sec = '(s){1,2}';
  private time = `${this.hour}:${this.min}(:${this.sec})?`;
  private dateTime = `^((${this.date} ${this.time})|${this.date}|${this.time})$`;

  private dateString = `\\d{4}\\-\\d{1,2}\\-\\d{1,2}`;
  private timeString = `\\d{1,2}:\\d{1,2}(:\\d{1,2})?`;
  private dateTimeString = `^((${this.dateString} ${this.timeString})|${this.dateString}|${this.timeString})$`;

  public formatValue(value: string, format: string): string {
    this.validate(value, format);
    const date: string = this.formatDate(value, format);
    const time: string = this.formatTime(value, format);
    return date && time ? date + ' ' + time : date + time;
  }

  private validate(value: Value, format?: string): void {
    this.validateString(value);
    this.validateFormat(format);
  }

  private validateString(value: Value): void {
    if (typeof value !== 'string') {
      throw new Error(`Invalid string value '${value}'.`);
    }
    if (!RegExp(this.dateTimeString).test(value)) {
      throw new Error(
        `Value '${value}' does not respect corresponding pattern: '${this.dateTimeString}'.`
      );
    }
  }

  private validateFormat(format?: string): void {
    if (this.isValidFormat(format)) return;
    throw new Error(
      `Format '${format}' does not respect corresponding pattern: '${this.dateTime}'.`
    );
  }

  private isValidFormat(format?: string): boolean {
    return format &&
      RegExp(this.dateTime).test(format) &&
      this.hasValidDelimiters(format)
      ? true
      : false;
  }

  private hasValidDelimiters(format: string): boolean {
    const dateFormatArray: RegExpMatchArray | null = //
      format.match(new RegExp(this.date));
    if (dateFormatArray) {
      const dateFormat: string = dateFormatArray[0];
      let delimiter = 0;
      delimiter = dateFormat.includes('.') ? delimiter + 1 : delimiter;
      delimiter = dateFormat.includes('-') ? delimiter + 1 : delimiter;
      delimiter = dateFormat.includes('/') ? delimiter + 1 : delimiter;
      return delimiter === 1;
    }
    return true;
  }

  private formatDate(value: string, format: string): string {
    const dateArray: RegExpMatchArray | null = //
      value.match(new RegExp(this.dateString));
    if (!dateArray) return '';
    const [year, month, day] = this.toDateParts(dateArray[0]);
    return this.toDate(year, month, day, format);
  }

  private toDateParts(dateString: string): [number, number, number] {
    const dateParts: string[] = dateString.split('-');
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);
    const date: Date = new Date(year, month - 1, day);
    if (month !== date.getMonth() + 1 || day !== date.getDate()) {
      throw new Error(
        `Invalid params '${year}-${month}-${day}' for date '${date.toString()}'`
      );
    }
    return [year, month, day];
  }

  private toDate(
    year: number,
    month: number,
    day: number,
    format: string
  ): string {
    const dateFormatArray: RegExpMatchArray | null = //
      format.match(new RegExp(this.date));
    if (!dateFormatArray) return '';
    const dateFormat: string = dateFormatArray[0];
    const dotArray: RegExpMatchArray | null = //
      format.match(new RegExp(this.dot));
    if (!dotArray) return '';
    const dotFormat: string = dotArray[0];
    const dateFormatParts: string[] = dateFormat.split(dotFormat);
    let result = '';
    for (let i = 0; i < dateFormatParts.length; i++) {
      if (i > 0) result += dotFormat;
      const formatPart: string = dateFormatParts[i];
      if (formatPart.startsWith('y')) {
        result += this.cutFirst2Digits('' + year, formatPart);
      } else if (formatPart.startsWith('M')) {
        result += this.insertLeadingZero('' + month, formatPart);
      } else if (formatPart.startsWith('d')) {
        result += this.insertLeadingZero('' + day, formatPart);
      }
    }
    return result;
  }

  private cutFirst2Digits(value: string, format: string): string {
    return value.length === 4 && format.length < 3 ? value.substring(2) : value;
  }

  private formatTime(value: string, format: string): string {
    const timeArray: RegExpMatchArray | null = //
      value.match(new RegExp(this.timeString));
    if (!timeArray) return '';
    const [hour, min, sec] = this.toTimeParts(timeArray[0]);
    return this.toTime(format, hour, min, sec);
  }

  private toTimeParts(
    timeString: string
  ): [number, number, number | undefined] {
    const timeParts: string[] = timeString.split(':');
    const hour = Number(timeParts[0]);
    const min = Number(timeParts[1]);
    const sec: number | undefined = timeParts[2]
      ? Number(timeParts[2])
      : undefined;
    const time: Date = new Date();
    time.setHours(hour);
    time.setMinutes(min);
    sec !== undefined && time.setSeconds(sec);
    const isValidDate: boolean =
      hour === time.getHours() &&
      min === time.getMinutes() &&
      (sec === undefined || sec === time.getSeconds());
    if (!isValidDate) {
      throw new Error(
        `Invalid params '${hour}:${min}:${sec}' for time '${time}'.`
      );
    }
    return [hour, min, sec];
  }

  private toTime(
    format: string,
    hour: number,
    min: number,
    sec?: number
  ): string {
    const timeFormatArray: RegExpMatchArray | null = //
      format.match(new RegExp(this.time));
    if (!timeFormatArray) return '';
    let result = '';
    const timeFormat: string = timeFormatArray[0];
    const timeFormatParts: string[] = timeFormat.split(':');
    result += this.insertLeadingZero('' + hour, timeFormatParts[0]) + ':';
    result += this.insertLeadingZero('' + min, timeFormatParts[1]);
    const secFormat: string | undefined = timeFormatParts[2];
    if (sec !== undefined && secFormat) {
      result += ':' + this.insertLeadingZero('' + sec, secFormat);
    }
    return result;
  }

  private insertLeadingZero(value: string, format: string): string {
    return format.length > value.length ? '0' + value : value;
  }
}

export class FitCellDateFormatterFactory implements CellFormatterFactory {
  public createCellFormatter(): CellFormatter {
    return new FitCellDateFormatter();
  }
}
