import {NgModule} from '@angular/core';
import {SharedComponent} from './components/shared.component';
import {FirstSingleComponent} from './components/first-single.component';
import {SecondSingleComponent} from './components/second-single.component';

@NgModule({
	declarations: [
		FirstSingleComponent,
		SecondSingleComponent,
		SharedComponent
	]
})
export class SingleModule {};
