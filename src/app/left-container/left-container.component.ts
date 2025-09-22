import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faLocationDot } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-left-container',
  imports: [FaIconComponent],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css'
})
export class LeftContainerComponent {
  faMagnifyingGlass:any = faMagnifyingGlass
  faLocationDot:any = faLocationDot
}
