import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditpasswordPageRoutingModule } from './editpassword-routing.module';

import { EditpasswordPage } from './editpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditpasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditpasswordPage]
})
export class EditpasswordPageModule {}
