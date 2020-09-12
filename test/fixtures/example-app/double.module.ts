import {NgModule} from '@angular/core';
import {DoubleFirstModuleFirstComponent} from './components/first-double-module-first.component';
import {DoubleFirstModuleSecondComponent} from './components/first-double-module-second.component';
import {DoubleSecondModuleFirstComponent} from './components/second-double-module-first.component';
import {DoubleSecondModuleSecondComponent} from './components/second-double-module-second.component';
import {SharedComponent} from './components/shared.component';

@NgModule({
	declarations: [
		DoubleFirstModuleFirstComponent,
		DoubleFirstModuleSecondComponent,
		SharedComponent
	]
})
export class DoubleFirstModule {};

@NgModule({
	declarations: [
		DoubleSecondModuleFirstComponent,
		DoubleSecondModuleSecondComponent,
		SharedComponent
	]
})
export class DoubleSecondModule {};
