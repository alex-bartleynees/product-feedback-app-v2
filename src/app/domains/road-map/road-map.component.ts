import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  computed,
} from '@angular/core';
import { SuggestionsFacadeService } from '@product-feedback-app-v2/core-state';
import { RoadMapCardComponent } from './components/road-map-card/road-map-card.component';
import {
  BackButtonComponent,
  HeaderComponent,
} from '@product-feedback-app-v2/shared';

@Component({
  selector: 'product-feedback-app-v2-road-map',
  templateUrl: './road-map.component.html',
  styleUrls: ['./road-map.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RoadMapCardComponent,
    HeaderComponent,
    BackButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('plannedTab') plannedTab!: ElementRef;
  allSuggestions = this.suggestionsFacade.allSuggestions();
  suggestions = computed(() => ({
    planned: this.suggestionsFacade.plannedSuggestions(),
    inProgress: this.suggestionsFacade.inProgressSuggestions(),
    live: this.suggestionsFacade.liveSuggestions(),
  }));

  selectedTab!: HTMLDivElement;
  selectedTabName = 'planned';
  isMobile = window.innerWidth <= 700 ? true : false;

  constructor(
    private suggestionsFacade: SuggestionsFacadeService,
    private renderer: Renderer2
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 700) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.renderer.addClass(document.body, 'suggestions');
    }
  }

  ngAfterViewInit(): void {
    this.selectedTab = this.plannedTab.nativeElement;
  }

  tabSelected(tab: string, tabElement: HTMLDivElement) {
    this.renderer.removeClass(this.selectedTab, 'tab__selected');
    this.renderer.removeClass(
      this.selectedTab,
      `tab__selected--${this.selectedTabName}`
    );
    this.selectedTab = tabElement;
    this.selectedTabName = tab;
    this.renderer.addClass(tabElement, `tab__selected`);
    this.renderer.addClass(tabElement, `tab__selected--${tab}`);
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      this.renderer.removeClass(document.body, 'suggestions');
    }
  }
}
