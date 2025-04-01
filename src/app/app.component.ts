import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LoaderComponent } from './loader/loader.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule,
    CommonModule],
})
export class AppComponent {
  myLoadingVariable: boolean = false;
  isDownloading: boolean = false;
  activeRoute: any;
  tabRoutes = ['/page1', '/page2', '/page3', '/page4'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
      });
  }

  async downloadPDF(): Promise<void> {
    this.isDownloading = true;
    this.myLoadingVariable = true;
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < this.tabRoutes.length; i++) {
      await this.router.navigateByUrl(this.tabRoutes[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const content = document.querySelector('.content') as HTMLElement;
      if (content) {
        const canvas = await html2canvas(content, { useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        pdf.setFontSize(14);
        pdf.text('PDF POC', pageWidth / 2, 10, { align: 'center' });

        pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);

        // Add Clickable Links
        pdf.setFontSize(12);
        const linkY = imgHeight + 30; // Adjust vertical spacing

        // Generate absolute URLs for links
        const baseUrl = window.location.origin; // Get the base URL of your app

        pdf.textWithLink('Go to ' + this.tabRoutes[i], 10, linkY, {
          url: baseUrl + this.tabRoutes[i],
        });

        pdf.setFontSize(10);
        pdf.text('PDF Done', pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    }

    pdf.save('tabs-content.pdf');
    this.myLoadingVariable = false;
    this.isDownloading = false;
  }
}