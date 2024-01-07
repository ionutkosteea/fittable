import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';

export function appendStyleChange(
  source: StyleChange,
  target: StyleChange
): void {
  target.createStyles = target.createStyles.concat(source.createStyles);
  target.updateStyles = target.updateStyles.concat(source.updateStyles);
  target.removeStyles = target.removeStyles.concat(source.removeStyles);
  target.cellStyleNames = target.cellStyleNames.concat(source.cellStyleNames);
}
