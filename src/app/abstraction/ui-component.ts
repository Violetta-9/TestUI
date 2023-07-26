import {Component, OnDestroy, OnInit} from "@angular/core";
import {UIService} from "./ui-service";
import {Subject} from "rxjs";
@Component({
  template: ''
})
export abstract class UIComponent<VIEW_MODEL> implements OnInit,OnDestroy{

  protected constructor(protected uiService: UIService<VIEW_MODEL>) {
  }
  protected unsubscribe: Subject<void> = new Subject();

  ngOnInit(): void {
    this.uiService.ngOnInit();
  }

  get model(): VIEW_MODEL {
    return this.uiService.model;
  }

  set model(_model: VIEW_MODEL) {
    this.uiService.model = _model;
  }

  public ngOnDestroy(): void {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
