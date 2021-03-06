import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Sign }        from '../sign.model';
import { IconService } from '../../core/services/icon.service';
import { ApiInteractionLoggerService } from '../../core/api/api-interaction-logger.service';
import { GAEventService } from '../../core/services/ga-event.service';

@Component({
  moduleId: module.id,
  selector: 'sign',
  templateUrl: 'sign.component.html',
  styleUrls:  ['sign.component.css']
})

export class SignComponent {
  @Input()  forNewSign = false;  // default to existing sign
  @Input()  sign: Sign;
  @Output() saveEE    = new EventEmitter<any>();
  @Output() destroyEE = new EventEmitter<any>();

  constructor( private icons:        IconService,
               private interactions: ApiInteractionLoggerService,
               private gaEvent:     GAEventService ) {}

  buildIconClass(icon: string, size: string = '2') {
    return this.icons.buildIconClass(icon, size);
  }

  getFormType(signType: string): string {
    switch (signType) {
      case 'custom':   return 'custom';
      case 'generic':  return 'generic';
      // If not made explicitly for another type, assume oauth type
      default:         return 'oauth';
    }
  }

  destroy(event: any) {
    console.log("SIGNCOMPONENT DESTROY EVENT IS EMITTING EVENT TO ADD-SIGN: ", event);
    this.destroyEE.emit(event);
  }

  save(event: any): void {
    // Sign preview
    if(event && event.preview === true) {
      this.sign = event.sign;
      return;
    }
    // Sign creation
    else {
      console.log("SIGN AT THE SIGN_COMPONENT LEVEL IS: ", event);
      this.saveEE.emit(event);    // keep passing the sign up
    }
  }

  logInteraction() {
    console.log("INTERACTION CLICKED");
    this.gaEvent.emitEvent('signlinkoff', 'click', this.sign.icon);
    const userId = window.localStorage.getItem('userId') || 'null';
    this.interactions.logSignLinkOffClick(this.sign._id, this.sign.icon, userId);
  }
}
