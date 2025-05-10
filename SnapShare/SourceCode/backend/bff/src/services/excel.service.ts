import * as XLSX from 'xlsx';
import { createInvitationSchema } from '../validation/invitation.validation';

export const extractInvitationsFromExcel = (buffer: Buffer, eventId: string): any[] => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  const validatedData = jsonData.map((row: any, index: number) => {
    // Add eventId to the row
    row.eventId = eventId;

    // Validate the row with the added eventId
    const { error, value } = createInvitationSchema.validate(row, { abortEarly: false });
    if (error) {
      throw new Error(`Validation error in row ${index + 2}: ${error.message}`);
    }
    return value;
  });

  return validatedData;
};
