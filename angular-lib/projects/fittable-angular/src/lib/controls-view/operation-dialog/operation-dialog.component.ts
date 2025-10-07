import {
  CommonModule
} from "@angular/common";
import {
  Component,
  input,
} from "@angular/core";

import {
  getLanguageDictionary
} from "fittable-core/model";
import {
  DialogField,
  FieldType,
  FieldValue,
  OperationDialog
} from "fittable-core/view-model";

@Component({
  selector: 'fit-operation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './operation-dialog.component.html',
  styleUrl: './operation-dialog.component.scss',
})
export class OperationDialogComponent {
  model = input.required<OperationDialog>();

  get show(): boolean {
    return this.model().isVisible();
  }

  get title(): string {
    return this.model().getTitle();
  }

  get fieldIds(): string[] {
    return this.model().getFieldIds();
  }

  getFieldLabel(id: string): string {
    return this.getField(id).getLabel();
  }

  getFieldType(id: string): FieldType {
    return this.getField(id).getType();
  }

  getFieldValue(id: string): FieldValue | undefined {
    return this.getField(id).getValue();
  }

  setNumberValue(id: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.getField(id).setValue(Number(input.value));
  }

  setBooleanValue(id: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.getField(id).setValue(Boolean(input.checked));
  }

  get okLabel(): string {
    return getLanguageDictionary().getText('Ok');
  }

  ok(): void {
    this.model().run();
  }

  get cancelLabel(): string {
    return getLanguageDictionary().getText('Cancel');
  }

  cancel(): void {
    this.model().setVisible(false);
  }
  get canRun(): boolean {
    return this.model().canRun();
  }

  private getField(id: string): DialogField {
    const field = this.model().getField(id);
    if (field) return field;
    throw new Error(`Field with id ${id} not found`);
  }
}
