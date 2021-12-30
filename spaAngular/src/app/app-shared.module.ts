import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { AppMaterialModule } from './app-material.module';
import * as FileSaver from 'file-saver';
import { LoadingComponent } from './components/loading/loading.component';
//import { PerfilUsuarioComponent } from './components/perfil/perfil-usuario.component';
import { EnviarMensajeComponent } from './components/usuarios/enviar-mensaje/enviar-mensaje.component';
// import { FileInputComponent } from './components/file/file-input/file-input.component';
// import { MultipleFileInputComponent } from './components/file/multiple-file-input/multiple-file-input.component';
// import { VisualizarPdfComponent } from './components/file/visualizar-pdf/visualizar-pdf.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileInputComponent } from './components/file/file-input/file-input.component';
import { MultipleFileInputComponent } from './components/file/multiple-file-input/multiple-file-input.component';
import { VisualizarPdfComponent } from './components/file/visualizar-pdf/visualizar-pdf.component';
import { AgregarPedidoComponent } from './components/carrito/agregar-pedido/agregar-pedido.component';
import { EditarProductoComponent } from './components/carrito/editar-producto/editar-producto.component';
import { AsignarProductoComponent } from './components/carrito/asignar-producto/asignar-producto.component';

// Modulo que importa y exporta los componentes y modulos usados entre los modulos y que pueden ser llamados por ellos.
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ChartsModule,
        AppMaterialModule,
    ],
    declarations: [
        LoadingComponent,
        EnviarMensajeComponent,
        FileInputComponent,
        MultipleFileInputComponent,
        VisualizarPdfComponent,
        AgregarPedidoComponent,
        EditarProductoComponent,
        AsignarProductoComponent
    ],
    exports: [
        // Modulos generales
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ChartsModule,
        AppMaterialModule,

        // //Componentes modal generales
        LoadingComponent,
        EnviarMensajeComponent,
        FileInputComponent,
        MultipleFileInputComponent,
        VisualizarPdfComponent,
    ],
    entryComponents: [
        AgregarPedidoComponent,
        EditarProductoComponent,
        AsignarProductoComponent
    ]
})

export class AppSharedModule { }
