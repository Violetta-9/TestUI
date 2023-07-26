import { Injectable } from '@angular/core';
import { StatesService, StatesDTO } from '../core/services/swagger-gen/service';
import {Observable, Subscription, takeUntil, tap} from 'rxjs';
import {UIService} from "../abstraction/ui-service";

@Injectable({
  providedIn: 'root'
})
export class UsMapService  extends UIService<StatesDTO>{
  public riskColors = ['#808080', '#A1FF2C', '#FFFF00', '#FFA500', '#FF0000', '#780d0d'];
  public stateData: StatesDTO[];
  public dataObservable: Observable<StatesDTO[]>;
  constructor(private statesService: StatesService) {
    super();
  }

  public getRiskColor(stateCode: string): string {
    let state = this.getDataForState(stateCode);
    if (!state) return this.riskColors[0];
    let riskLevel = state.riskLevel
    return this.riskColors[riskLevel];
  }

  private getDataForState(stateCode: string): any {
    return this.stateData.find((data) => data.stateCode == +stateCode);
  }
  public loadData(riskOption:number=1) {
    switch (riskOption) {
      case 2: {
        this.dataObservable = this.statesService.getCasesPer100kLevel();
        break;
      }
      case 3: {
        this.dataObservable = this.statesService.getPositivityTestLevel();
        break;
      }
      case 4: {
        this.dataObservable = this.statesService.getInfectionLevel();
        break;
      }
      default: {
        this.dataObservable = this.statesService.getOverallLevel();
        break
      }
    }

    return this.dataObservable.pipe(tap(x=>this.stateData=x));
  }

}
