import {} from 'jasmine';

import { TableOperationExecutor } from './model/table-operation-executor.js';

describe('Style Border Operation Executor', () => {
  let executor: TableOperationExecutor;

  beforeEach(() => {
    executor = new TableOperationExecutor();
  });

  it('border left', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'left',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-left')).toBeTruthy();
  });

  it('undo border left', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'left',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
  });

  it('border top', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'top',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-top')).toBeTruthy();
  });

  it('undo border top', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'top',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
  });

  it('border right', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'right',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-right')).toBeTruthy();
  });

  it('undo border right', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'right',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
  });

  it('border bottom', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'bottom',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-bottom')).toBeTruthy();
  });

  it('undo border bottom', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'bottom',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
  });

  it('border center', () => {
    executor //
      .createTable(1, 2)
      .selectCell(0, 0)
      .selectCell(0, 1)
      .runPaintBorder({
        location: 'center',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(0, 1) === 's1').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-right')).toBeTruthy();
    expect(executor.getStyle('s1')?.get('border-left')).toBeTruthy();
  });

  it('undo border center', () => {
    executor //
      .createTable(1, 2)
      .selectCell(0, 0)
      .selectCell(0, 1)
      .runPaintBorder({
        location: 'center',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getCellStyleName(0, 1) === 's1').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getStyle('s1')).toBeFalsy();
  });

  it('border middle', () => {
    executor //
      .createTable(2, 1)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runPaintBorder({
        location: 'middle',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's1').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-bottom')).toBeTruthy();
    expect(executor.getStyle('s1')?.get('border-top')).toBeTruthy();
  });

  it('undo border middle', () => {
    executor //
      .createTable(2, 1)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runPaintBorder({
        location: 'middle',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getCellStyleName(1, 0) === 's1').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getStyle('s1')).toBeFalsy();
  });

  it('border cross', () => {
    executor //
      .createTable(2, 2)
      .selectCell(0, 0)
      .selectCell(0, 1)
      .selectCell(1, 0)
      .selectCell(1, 1)
      .runPaintBorder({
        location: 'cross',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(0, 1) === 's1').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's2').toBeTruthy();
    expect(executor.getCellStyleName(1, 1) === 's3').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-right')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-bottom')).toBeTruthy();
    expect(executor.getStyle('s1')?.get('border-left')).toBeTruthy();
    expect(executor.getStyle('s1')?.get('border-bottom')).toBeTruthy();
    expect(executor.getStyle('s2')?.get('border-right')).toBeTruthy();
    expect(executor.getStyle('s2')?.get('border-top')).toBeTruthy();
    expect(executor.getStyle('s3')?.get('border-left')).toBeTruthy();
    expect(executor.getStyle('s3')?.get('border-top')).toBeTruthy();
  });

  it('undo border cross', () => {
    executor //
      .createTable(2, 2)
      .selectCell(0, 0)
      .selectCell(0, 1)
      .selectCell(1, 0)
      .selectCell(1, 1)
      .runPaintBorder({
        location: 'cross',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getCellStyleName(0, 1) === 's1').toBeFalsy();
    expect(executor.getCellStyleName(1, 0) === 's2').toBeFalsy();
    expect(executor.getCellStyleName(1, 1) === 's3').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getStyle('s1')).toBeFalsy();
    expect(executor.getStyle('s2')).toBeFalsy();
    expect(executor.getStyle('s3')).toBeFalsy();
  });

  it('border around', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'around',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-left')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-top')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-right')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-bottom')).toBeTruthy();
  });

  it('undo border around', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runPaintBorder({
        location: 'around',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
  });

  it('border all', () => {
    executor //
      .createTable(2, 2)
      .selectCell(0, 0)
      .selectCell(0, 1)
      .selectCell(1, 0)
      .selectCell(1, 1)
      .runPaintBorder({
        location: 'all',
        color: 'black',
        thickness: 1,
        type: 'solid',
      });

    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(0, 1) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 1) === 's0').toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-left')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-top')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-right')).toBeTruthy();
    expect(executor.getStyle('s0')?.get('border-bottom')).toBeTruthy();
  });

  it('undo border all', () => {
    executor //
      .createTable(2, 2)
      .selectCell(0, 0)
      .selectCell(0, 1)
      .selectCell(1, 0)
      .selectCell(1, 1)
      .runPaintBorder({
        location: 'all',
        color: 'black',
        thickness: 1,
        type: 'solid',
      })
      .runUndo();

    expect(executor.getCellStyleName(0, 0) === 's0').toBeFalsy();
    expect(executor.getCellStyleName(1, 0) === 's0').toBeFalsy();
    expect(executor.getCellStyleName(0, 1) === 's0').toBeFalsy();
    expect(executor.getCellStyleName(1, 1) === 's0').toBeFalsy();
    expect(executor.getStyle('s0')).toBeFalsy();
  });
});
