import { Component } from '@angular/core';
import { Http } from '@angular/http'
import { FileSelectDirective, FileDropDirective, FileUploader, Headers, FileLikeObject } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:32993/api/fileupload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent {
    title = 'Energetics Web Application';
    public myHeaders: Headers[] = [];
    public uploader: FileUploader = new FileUploader({
        url: URL,
        isHTML5: true,
        allowedMimeType :['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
        //headers: <Headers[]>[
        //    { name: 'Content-Type', value: 'multipart/form-data' }
        //]
    });
    errorMessage: string;
    allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
    maxFileSize = 10 * 1024 * 1024;

    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }


    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    constructor(private _httpService: Http) {
        this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    }
    apiValues: string[] = [];
    ngOnInit() {
        //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
        //overide the onCompleteItem property of the uploader so we are 
        //able to deal with the server response.
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            console.log("ImageUpload:uploaded:", item, status, response);
        };

        this._httpService.get(URL).subscribe(values => {
            this.apiValues = values.json() as string[];
        });
    }

    onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any) {
        switch (filter.name) {
            case 'fileSize':
                this.errorMessage = `Maximum upload size exceeded (${item.size} of ${this.maxFileSize} allowed)`;
                break;
            case 'mimeType':
                const allowedTypes = this.allowedMimeType.join();
                this.errorMessage = `Type "${item.type} is not allowed. Allowed types: "${allowedTypes}"`;
                break;
            default:
                this.errorMessage = `Unknown error (filter is ${filter.name})`;
        }
    }

    uploadFile() {
        this.uploader.uploadAll();
    }
}
