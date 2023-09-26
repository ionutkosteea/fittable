import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export function appendStyleStepsDto(
  source: StyleOperationStepDto,
  target: StyleOperationStepDto
): void {
  target.createStyles = target.createStyles.concat(source.createStyles);
  target.updateStyles = target.updateStyles.concat(source.updateStyles);
  target.removeStyles = target.removeStyles.concat(source.removeStyles);
  target.cellStyleNames = target.cellStyleNames.concat(source.cellStyleNames);
}
