import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export function appendStyleStepsDto(
  source: StyleOperationStepDto,
  target: StyleOperationStepDto
): void {
  source.createStyles.forEach((data) => target.createStyles.push(data));
  source.updateStyles.forEach((data) => target.updateStyles.push(data));
  source.removeStyles.forEach((name) => target.removeStyles.push(name));
  source.cellStyleNames.forEach((styleName) =>
    target.cellStyleNames.push(styleName)
  );
}
