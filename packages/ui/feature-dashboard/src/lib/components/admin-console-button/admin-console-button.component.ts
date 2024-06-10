import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DashboardService,
  FlagService,
  NavigationService,
  UiCommonModule,
} from '@activepieces/ui/common';
import { Observable, tap } from 'rxjs';
import { InviteUserDialogComponent } from '../dialogs/invite-user-dialog/invite-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-console-button',
  standalone: true,
  imports: [CommonModule, UiCommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ap-flex ap-gap-2">
      <ap-button
        btnColor="white"
        btnStyle="stroked"
        btnSize="medium"
        (buttonClicked)="openInviteAdminDialog()"
        i18n
      >
        <div class="ap-flex ap-gap-2 ap-items-center">
          <svg-icon
            [applyClass]="true"
            [svgStyle]="{ width: '18px', height: '18px' }"
            src="assets/img/custom/person_add.svg"
          ></svg-icon>
          <b>Invite user</b>
        </div>
      </ap-button>

      @if(showPlatform && !isInPlatformRoute){
      <ap-button
        btnColor="white"
        btnStyle="stroked"
        btnSize="medium"
        (buttonClicked)="navigateToAdminConsole()"
        i18n
      >
        <div class="ap-flex ap-gap-2 ap-items-center">
          @if(isVersionMatch$ | async) {
          <svg-icon
            [applyClass]="true"
            class="ap-fill-disable"
            [svgStyle]="{ width: '8px', height: '8px' }"
            class="ap-fill-danger"
            [matTooltip]="newUpdateMessage"
            src="assets/img/custom/notification_important.svg"
          >
          </svg-icon>
          }
          <svg-icon
            [applyClass]="true"
            [svgStyle]="{ width: '18px', height: '18px' }"
            src="assets/img/custom/dashboard/projects.svg"
          ></svg-icon>

          <b>Platform Admin</b>
        </div>
      </ap-button>
      } @if(isInPlatformRoute) {
      <ap-button
        btnColor="white"
        btnStyle="stroked"
        btnSize="medium"
        (buttonClicked)="navigateToProjectDashboard()"
        i18n
      >
        <div class="ap-flex ap-gap-2 ap-items-center">
          <b>Exit Platform Admin</b>
        </div>
      </ap-button>
      }
    </div>

    @if(navigateToAdminConsole$ |async) {}
  `,
})
export class AdminConsoleButtonComponent {
  readonly newUpdateMessage = $localize`New update available`;
  @Input({ required: true }) showPlatform = false;
  @Input({ required: true }) isInPlatformRoute = false;
  isVersionMatch$: Observable<boolean>;
  isInPlatformRoute$: Observable<boolean>;
  navigateToAdminConsole$?: Observable<boolean>;
  constructor(
    private flagService: FlagService,
    private matDialog: MatDialog,
    private dashboardService: DashboardService,
    private navigationService: NavigationService
  ) {
    this.isVersionMatch$ = this.flagService.isVersionMatch();
    this.isInPlatformRoute$ = this.dashboardService.getIsInPlatformRoute();
  }

  navigateToAdminConsole() {
    this.navigateToAdminConsole$ = this.isVersionMatch$.pipe(
      tap((navigateToVersionsList) => {
        if (navigateToVersionsList) {
          this.navigationService.navigate({ route: ['/platform/settings'] });
        } else {
          this.navigationService.navigate({ route: ['/platform'] });
        }
      })
    );
  }

  openInviteAdminDialog() {
    this.matDialog.open(InviteUserDialogComponent);
  }

  navigateToProjectDashboard() {
    this.navigationService.navigate({ route: ['/'] });
  }
}
