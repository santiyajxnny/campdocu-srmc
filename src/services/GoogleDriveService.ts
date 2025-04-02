
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface DriveCredentials {
  accessToken: string;
  expiresAt: number;
}

interface SyncQueueItem {
  campId: string;
  patients: any[];
}

interface CampResources {
  folderId: string;
  spreadsheetId: string;
  folderUrl: string;
  spreadsheetUrl: string;
}

// Service class for Google Drive operations
class GoogleDriveService {
  private drive: any = null;
  private sheets: any = null;
  private credentials: DriveCredentials | null = null;
  private syncQueue: SyncQueueItem[] = [];
  private isSyncing: boolean = false;

  constructor() {
    // Try to load credentials from localStorage
    this.loadCredentials();
    this.initializeSyncQueue();
  }

  loadCredentials() {
    try {
      const savedCreds = localStorage.getItem('driveCredentials');
      if (savedCreds) {
        this.credentials = JSON.parse(savedCreds);
        
        // Check if token is expired
        if (this.credentials && this.credentials.expiresAt < Date.now()) {
          this.credentials = null;
          localStorage.removeItem('driveCredentials');
        } else {
          this.initializeApis();
        }
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
      this.credentials = null;
    }
  }

  initializeApis() {
    if (!this.credentials) return;
    
    try {
      // In a real implementation, we'd initialize APIs with the google SDK
      // For now, let's mock this functionality
      this.drive = {
        files: {
          create: this.mockCreateFile.bind(this),
          get: this.mockGetFile.bind(this),
          list: this.mockListFiles.bind(this)
        },
        permissions: {
          create: this.mockCreatePermission.bind(this)
        }
      };
      
      this.sheets = {
        spreadsheets: {
          values: {
            update: this.mockUpdateSheet.bind(this)
          }
        }
      };
    } catch (error) {
      console.error('Failed to initialize APIs:', error);
      this.logout();
    }
  }

  initializeSyncQueue() {
    // Load pending sync operations from localStorage
    try {
      const savedQueue = localStorage.getItem('driveSyncQueue');
      if (savedQueue) {
        this.syncQueue = JSON.parse(savedQueue);
      }
      
      // Start processing the queue if there are items
      if (this.syncQueue.length > 0 && this.isAuthenticated()) {
        this.processSyncQueue();
      }
    } catch (error) {
      console.error('Failed to initialize sync queue:', error);
      this.syncQueue = [];
    }
  }

  setCredentials(token: string, expiresIn: number): boolean {
    this.credentials = {
      accessToken: token,
      expiresAt: Date.now() + expiresIn * 1000
    };
    
    // Save to localStorage
    localStorage.setItem('driveCredentials', JSON.stringify(this.credentials));
    this.initializeApis();
    
    // Process any pending sync operations
    if (this.syncQueue.length > 0) {
      this.processSyncQueue();
    }
    
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.credentials && this.credentials.expiresAt > Date.now();
  }

  logout(): void {
    this.credentials = null;
    localStorage.removeItem('driveCredentials');
    this.drive = null;
    this.sheets = null;
  }

  async createCampResources(campName: string, campDate: Date, assignedStudents?: string[]): Promise<CampResources | null> {
    if (!this.isAuthenticated()) {
      toast.error('Not authenticated with Google Drive');
      return null;
    }
    
    try {
      // Format camp name with date for folder name
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }).format(campDate);
      
      const folderName = `Eye Camp - ${campName} (${formattedDate})`;
      
      // 1. Create main folder
      const folderResponse = await this.drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder'
        },
        fields: 'id, webViewLink'
      });
      
      const folderId = folderResponse.data.id;
      const folderUrl = folderResponse.data.webViewLink;
      
      // 2. Create Excel template
      const spreadsheetId = await this.createExcelTemplate(folderId, campName, formattedDate);
      if (!spreadsheetId) {
        throw new Error('Failed to create Excel template');
      }
      
      // Get spreadsheet URL
      const spreadsheetResponse = await this.drive.files.get({
        fileId: spreadsheetId,
        fields: 'webViewLink'
      });
      
      const spreadsheetUrl = spreadsheetResponse.data.webViewLink;
      
      // 3. Create images folder
      await this.drive.files.create({
        requestBody: {
          name: 'Patient Documentation Images',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folderId]
        }
      });
      
      // 4. Share with assigned students if provided
      if (assignedStudents && assignedStudents.length > 0) {
        await this.shareWithStudents(folderId, assignedStudents);
      }
      
      return {
        folderId,
        spreadsheetId,
        folderUrl,
        spreadsheetUrl
      };
    } catch (error) {
      console.error('Error creating camp resources:', error);
      toast.error('Failed to create Drive resources. Please try again.');
      return null;
    }
  }

  private async createExcelTemplate(parentFolderId: string, campName: string, formattedDate: string): Promise<string | null> {
    try {
      // Create Excel file with patient data template
      const workbook = XLSX.utils.book_new();
      
      // Create headers for the patient data sheet
      const headers = [
        'Patient ID',
        'Name',
        'Age',
        'Sex',
        'History',
        'Vision Right',
        'Vision Left',
        'Dry Refraction Right',
        'Dry Refraction Left',
        'Acceptance Right',
        'Acceptance Left',
        'Ocular Diagnosis',
        'Outcome',
        'Created At',
        'Updated At'
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet([headers]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Records');
      
      // Format the sheet (column widths, etc.)
      const columnWidths = headers.map(() => ({ wch: 20 }));
      worksheet['!cols'] = columnWidths;
      
      // In a real app, we'd actually convert and upload
      // For mock purposes, let's simulate success

      const mockSpreadsheetId = `sheet-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      console.log('Mock Excel sheet created with ID:', mockSpreadsheetId);
      
      return mockSpreadsheetId;
    } catch (error) {
      console.error('Error creating Excel template:', error);
      return null;
    }
  }

  private async shareWithStudents(fileId: string, studentEmails: string[]): Promise<boolean> {
    try {
      // Create batch permission requests
      const batch = studentEmails.map(email => ({
        type: 'user',
        role: 'writer',
        emailAddress: email
      }));
      
      // Execute permission requests sequentially to avoid rate limits
      for (const permission of batch) {
        await this.drive.permissions.create({
          fileId: fileId,
          requestBody: permission,
          sendNotificationEmail: true
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error sharing with students:', error);
      return false;
    }
  }

  async syncPatientData(campId: string, patients: any[], spreadsheetId: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      // Queue the sync operation for later if not authenticated
      this.queueSyncOperation(campId, patients);
      toast.error('Not authenticated with Google Drive. Data will sync when you reconnect.');
      return false;
    }
    
    try {
      // Convert patient data to rows for spreadsheet
      const rows = patients.map(patient => [
        patient.id,
        patient.name,
        patient.age,
        patient.sex,
        patient.history || '',
        patient.visionRight || '',
        patient.visionLeft || '',
        patient.dryRefractionRight || '',
        patient.dryRefractionLeft || '',
        patient.acceptanceRight || '',
        patient.acceptanceLeft || '',
        patient.ocularDiagnosis || '',
        patient.outcome || '',
        patient.createdAt,
        patient.updatedAt
      ]);
      
      // Skip header row in the sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Patient Records!A2:O',
        valueInputOption: 'RAW',
        requestBody: {
          values: rows
        }
      });
      
      toast.success('Patient data synced with Google Sheets');
      return true;
    } catch (error) {
      console.error('Error syncing patient data:', error);
      this.queueSyncOperation(campId, patients);
      toast.error('Failed to sync data. Will retry when connection is restored.');
      return false;
    }
  }

  private queueSyncOperation(campId: string, patients: any[]): void {
    // Check if there's already an entry for this camp in the queue
    const existingIndex = this.syncQueue.findIndex(item => item.campId === campId);
    
    if (existingIndex !== -1) {
      // Update existing entry with latest data
      this.syncQueue[existingIndex].patients = patients;
    } else {
      // Add new entry to queue
      this.syncQueue.push({
        campId,
        patients
      });
    }
    
    // Save updated queue to localStorage
    localStorage.setItem('driveSyncQueue', JSON.stringify(this.syncQueue));
  }

  async processSyncQueue(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0 || !this.isAuthenticated()) {
      return;
    }
    
    this.isSyncing = true;
    
    try {
      // Process each item in the queue
      const successfulItems = [];
      
      for (const item of this.syncQueue) {
        // We would need to fetch the spreadsheetId from our database/storage based on campId
        // For now, let's assume we have a mock function to get it
        const spreadsheetId = await this.getSpreadsheetIdForCamp(item.campId);
        
        if (spreadsheetId) {
          const success = await this.syncPatientData(item.campId, item.patients, spreadsheetId);
          if (success) {
            successfulItems.push(item);
          }
        }
      }
      
      // Remove successful items from queue
      this.syncQueue = this.syncQueue.filter(item => !successfulItems.includes(item));
      
      // Update localStorage
      localStorage.setItem('driveSyncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Mock function - in real app, this would fetch from database
  private async getSpreadsheetIdForCamp(campId: string): Promise<string | null> {
    // In a real implementation, this would fetch the spreadsheet ID from your database
    const mockCampResources = JSON.parse(localStorage.getItem('campResources') || '{}');
    return mockCampResources[campId]?.spreadsheetId || null;
  }

  async uploadImageToDrive(campId: string, patientId: string, imageFile: File): Promise<string | null> {
    if (!this.isAuthenticated()) {
      toast.error('Not authenticated with Google Drive');
      return null;
    }
    
    try {
      // Get the camp folder ID
      const mockCampResources = JSON.parse(localStorage.getItem('campResources') || '{}');
      const folderId = mockCampResources[campId]?.folderId;
      
      if (!folderId) {
        throw new Error('Folder ID not found for this camp');
      }
      
      // Find or create patient images subfolder
      const imagesFolder = await this.findOrCreatePatientImagesFolder(folderId);
      if (!imagesFolder) {
        throw new Error('Could not create images folder');
      }
      
      // Upload the image
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileMetadata = {
        name: `${patientId}_${timestamp}.${imageFile.name.split('.').pop()}`,
        parents: [imagesFolder]
      };
      
      const media = {
        mimeType: imageFile.type,
        body: imageFile
      };
      
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
      });
      
      return response.data.webViewLink;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image to Drive');
      return null;
    }
  }

  private async findOrCreatePatientImagesFolder(campFolderId: string): Promise<string | null> {
    try {
      // Search for existing images folder
      const response = await this.drive.files.list({
        q: `'${campFolderId}' in parents and name='Patient Documentation Images' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id, name)'
      });
      
      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }
      
      // Create a new folder if not found
      const folderResponse = await this.drive.files.create({
        requestBody: {
          name: 'Patient Documentation Images',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [campFolderId]
        },
        fields: 'id'
      });
      
      return folderResponse.data.id;
    } catch (error) {
      console.error('Error finding/creating images folder:', error);
      return null;
    }
  }

  // Mock methods for testing without the actual Google API
  private async mockCreateFile(options: any): Promise<any> {
    const { requestBody, fields } = options;
    const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    console.log(`Mock creating file: ${requestBody.name}`, requestBody);
    
    return {
      data: {
        id,
        name: requestBody.name,
        webViewLink: `https://example.com/mock-drive/${id}`
      }
    };
  }

  private async mockGetFile(options: any): Promise<any> {
    const { fileId } = options;
    
    return {
      data: {
        id: fileId,
        webViewLink: `https://example.com/mock-drive/${fileId}`
      }
    };
  }

  private async mockListFiles(options: any): Promise<any> {
    return {
      data: {
        files: []
      }
    };
  }

  private async mockCreatePermission(options: any): Promise<any> {
    const { fileId, requestBody } = options;
    console.log(`Mock sharing ${fileId} with ${requestBody.emailAddress}`);
    
    return {
      data: {
        id: `perm-${Date.now()}`,
        type: requestBody.type,
        role: requestBody.role,
        emailAddress: requestBody.emailAddress
      }
    };
  }

  private async mockUpdateSheet(options: any): Promise<any> {
    const { spreadsheetId, range, requestBody } = options;
    console.log(`Mock updating sheet ${spreadsheetId} range ${range} with ${requestBody.values.length} rows`);
    
    return {
      data: {
        updatedRange: range,
        updatedRows: requestBody.values.length
      }
    };
  }
}

// Create a singleton instance
const driveService = new GoogleDriveService();
export default driveService;
