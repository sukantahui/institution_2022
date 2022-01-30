import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlipFlopComponent } from './flip-flop.component';

const routes: Routes = [{ path: '', component: FlipFlopComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlipFlopRoutingModule { }
