
import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'  // This makes the service available application-wide
  })export class FormGeneratorService {
  groups: any = [];
  toFormGroup(fields: any) {
    const group: any = {};

    for (const element of fields) {
      const tabValidation = [];
      if (element.isRequired && element.validations.length != 0) {
        for (const validation of element.validations) {
          if (validation.name == 'required' && validation.value) {
            tabValidation.push(Validators.required);
          }
          if (validation.name == 'minlength' && validation.value != '') {
            tabValidation.push(Validators.minLength(validation.value));
          }
          if (validation.name == 'maxlength' && validation.value != '') {
            tabValidation.push(Validators.maxLength(validation.value));
          }
          if (validation.name == 'max' && validation.value != '') {
            tabValidation.push(Validators.max(validation.value));
          }
          if (validation.name == 'min' && validation.value != '') {
            tabValidation.push(Validators.min(validation.value));
          }
          if (validation.name == 'pattern' && validation.value != '') {
            tabValidation.push(Validators.pattern(validation.value));
          }
        }
      }
      if (element.type == 'checkbox')
        {group[element.name] = new UntypedFormArray(element.value || [], tabValidation);}
      else
        {group[element.name] = new UntypedFormControl(element.value || '', tabValidation);}
    }
    return new UntypedFormGroup(group);
  }
  toFormGroup2(fields: any) {
    const group: any = {};
    for (const element of fields) {
      const tabValidation = [];
      if (element.isRequired && element.validations.length != 0) {
        for (const validation of element.validations) {
          if (validation.name == 'required' && validation.value) {
            tabValidation.push(Validators.required);
          }
          if (validation.name == 'minlength' && validation.value != '') {
            tabValidation.push(Validators.minLength(validation.value));
          }
          if (validation.name == 'maxlength' && validation.value != '') {
            tabValidation.push(Validators.maxLength(validation.value));
          }
          if (validation.name == 'max' && validation.value != '') {
            tabValidation.push(Validators.max(validation.value));
          }
          if (validation.name == 'min' && validation.value != '') {
            tabValidation.push(Validators.min(validation.value));
          }
          if (validation.name == 'pattern' && validation.value != '') {
            tabValidation.push(Validators.pattern(validation.value));
          }
        }
      }
      if (element.type == 'checkbox')
        {group[element.field] = new UntypedFormArray([], tabValidation);}
      else
        {group[element.field] = new UntypedFormControl('', tabValidation);}
    }
    return new UntypedFormGroup(group);
  }

  toFormGroup3(steppers: any) {
    const groups: any = {};
    let tabValidation = [];
    for(const stepper of steppers ){
      const group: any = {};
      tabValidation = [];
      for(const field of stepper.fields){
        if (field.isRequired && field.validations.length != 0) {
        for (const validation of field.validations) {
          if (validation.name == 'required' && validation.value) {
            tabValidation.push(Validators.required);
          }
          if (validation.name == 'minlength' && validation.value != '') {
            tabValidation.push(Validators.minLength(validation.value));
          }
          if (validation.name == 'maxlength' && validation.value != '') {
            tabValidation.push(Validators.maxLength(validation.value));
          }
          if (validation.name == 'max' && validation.value != '') {
            tabValidation.push(Validators.max(validation.value));
          }
          if (validation.name == 'min' && validation.value != '') {
            tabValidation.push(Validators.min(validation.value));
          }
          if (validation.name == 'pattern' && validation.value != '') {
            tabValidation.push(Validators.pattern(validation.value));
          }
        }
      }

      if (field.type == 'checkbox')
        {group[field.name] = new UntypedFormArray(field.value || [], tabValidation);}
      else
        {group[field.name] = new UntypedFormControl(field.value || '', tabValidation);}

    }
    groups[stepper.title] = new UntypedFormGroup(group);
  }

    return new UntypedFormGroup(groups);
  }
}
