import { Component, HostBinding, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IdentityUserService } from "../../../utils/IdentityUser/identity-user.service";
import { LoadingService } from "../../loading/loading.service";
import { FileUtilitiesService } from "../../../utils/service/file-utilities.service";

@Component({
    selector: 'app-visualizar-pdf',
    templateUrl: './visualizar-pdf.component.html',
    styleUrls: ['./visualizar-pdf.component.css'],
    providers: [FileUtilitiesService]
})
/** VisualizarPdf component*/
export class VisualizarPdfComponent implements OnInit {
    dataLocalUrl: string = "NA";
    url: string = "NA";

    constructor(
        private toastr: ToastrService,
        private identityUserService: IdentityUserService,
        private loadingService: LoadingService,
        public _DomSanitizationService: DomSanitizer,
        private fileService: FileUtilitiesService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<VisualizarPdfComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {url: string, s64: string}) {
    }

    ngOnInit(): void {
        if (this.data.s64) {
            this.dataLocalUrl = this.fileService.getFileBasse64(this.data.s64, "pdf");
            //this.loadingService.hide();
        }
        if (this.data.url) {
            this.url = this.data.url;
            //this.loadingService.hide();
        }
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }
    
    
}