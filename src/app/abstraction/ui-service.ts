import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs";
@Component({
  template: ''
})
export abstract class UIService<VIEW_MODEL> implements OnInit {

  protected unsubscribe: Subject<void> = new Subject();
  model: VIEW_MODEL;

  protected constructor() {

    this.model = <VIEW_MODEL>{};
  }
  ngOnInit(): void {

  }





}
