import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileInput } from '../../../models/file/FileInput';
import { ErrorValidationService } from '../../../utils/service/error-validation.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { ConstantsCatalogos } from '../../../utils/constants/ConstantsCatalogos';

@Component({
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.css']
})
// tslint:disable-next-line: jsdoc-format
/** file-input component*/
export class FileInputComponent {

    @Input() imagen: string;
    @Input() name: string;
    @Input() ext: string[];
    @Input() showImage: boolean;
    @Input() placeholder: string;
    @Input() reset: boolean;
    // tslint:disable-next-line: no-output-on-prefix
    @Output() onChangeFile = new EventEmitter<FileInput>();
    fileInput: FileInput = new FileInput('', '', '');
    urlPublic = ConstantsCatalogos.URL_PUBLIC;

    /** file-input ctor */
    constructor(
        private toastr: ToastrService,
        private errorValidationService: ErrorValidationService,
        // tslint:disable-next-line: variable-name
        public _DomSanitizationService: DomSanitizer
    ) {

    }

    onChange(event: any, name: string, ext?: any[]) {
        const files = event.srcElement.files;
        this.setFileInput(files[0], name, ext);
    }

    drop(event: any, name: string, ext?: any[]) {
        event.preventDefault();
        if (event.dataTransfer.items) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    this.setFileInput(event.dataTransfer.items[i].getAsFile(), name, ext);
                }
            }
        }
    }

    dragover(event: any) {
        event.preventDefault();
        event.srcElement.classList.add('file-drop-zone-drop');
    }

    dragleave(event: any) {
        event.srcElement.classList.remove('file-drop-zone-drop');
    }

    setFileInput(file: any, name: string, ext?: any[]) {
        // tslint:disable-next-line: triple-equals
        if (file != undefined) {
            this.reset = false;
            if (ext && !this.errorValidationService.isValidSomeFileExtension(file, ext)) {
                this.toastr.error('Archivo no cumple con la extensión requerida', 'Error');
            } else {
                if (file) {
                    if (name === 'NA') { name = this.errorValidationService.getFileName(file); }
                    this.fileInput = new FileInput(file, name, window.URL.createObjectURL(file));
                    this.onChangeFile.emit(this.fileInput);
                }
            }
        }
    }
}
