/**
 * - Overlap: Returns true if the two time overlap.
 * Input:
 * @param {*} incommingDateTimeRange {start: number, end: number}
 * @param {*} existingDateTimeRange {start: number, end: number}
 *
 * Output:
 * - Boolean: true or false
 */
export function areTwoDateTimeRangesOverlapping(
  incommingDateTimeRange,
  existingDateTimeRange,
) {
  return (
    incommingDateTimeRange.start < existingDateTimeRange.end &&
    incommingDateTimeRange.end > existingDateTimeRange.start
  );
}

/**
 * - getDate: Returns the numeric value of the specified date 
 * Input:
 * @param {*} dateTimeString {start: string, end: string}
 *
 *
 * Output:
 * - Object: {start: number, end: number}
 */

export function getDateTimeRangeFromString(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);

    return {
        start: startTime.getTime(),
        end: endTime.getTime(),
    }
}
