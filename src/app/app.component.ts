import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { DataApiService } from './core/services/data-api.service';
const DEVICE_NAME = 'cisco5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('svgImg', { static: false })  
  svgImg: any;
  title = 'angular-svg-project';

  canvasPositionInfo: any = undefined;
  deviceImagePositionInfo: any = undefined;

  switchImgUrl: string = 'assets/access.svg';
  redInterfaceUrl: string = 'assets/copperInterface-red.svg';
  greenInterfaceUrl: string = 'assets/copperInterface-green.svg';

  interfacesData: Array<any> = [];
  rearData: Array<any> = [];
  selectedInterfaceData: any;
  selectedRearItemData: any;

  isFrontPage = true;

  constructor(private renderer: Renderer2, private dataService: DataApiService) {}

  async ngOnInit() {
    const deviceName = 'cisco5';
    const { status: { vendor }, status: { model } } = await this.dataService.getDeviceData(deviceName).toPromise();
    const categoryName = `${vendor}__${model}`;
    const categoryData = await this.dataService.getUICatalogData(categoryName).toPromise();
    this.switchImgUrl = `assets/${categoryData.status.ui_info.device_image}`;
    const detailedInterfaceData = await Promise.all(categoryData.status.ui_info.front.map(item => this.dataService.getInterfaceData(`${item.name.replace(/\//g, '_')}-${DEVICE_NAME}`).toPromise()));

    setTimeout(() => {
      this.canvasPositionInfo  = document.getElementsByTagName('svg')[0].querySelector('rect').getBoundingClientRect();
      this.deviceImagePositionInfo = document.getElementsByTagName('svg')[0].querySelector('polygon').getBoundingClientRect();
      const UNIT_PIXEL_X = this.canvasPositionInfo.width / categoryData.status.ui_info.Dimensions.X;
      const UNIT_PIXEL_Y = this.canvasPositionInfo.height / categoryData.status.ui_info.Dimensions.Y;
      
      this.interfacesData = categoryData.status.ui_info.front.map((item, index) => ({
        positionX: item.x * UNIT_PIXEL_X,
        positionY: item.y * UNIT_PIXEL_Y,
        widthPixel: item.width * UNIT_PIXEL_X,
        heightPixel: item.height * UNIT_PIXEL_Y,
        backgroundImgUrl: `assets/${item.image}`,
        detail: detailedInterfaceData[index],
        ...item
      }));

      this.rearData = categoryData.status.ui_info.rear.map(item => ({
        positionX: item.x * UNIT_PIXEL_X,
        positionY: item.y * UNIT_PIXEL_Y,
        widthPixel: item.width * UNIT_PIXEL_X,
        heightPixel: item.height * UNIT_PIXEL_Y,
        backgroundImgUrl: `assets/${item.image}`,
        ...item
      }));
    }, 2000);
  }

  async getDetailedInterfaceData(name: string) {
    const interfaceName = name.replace(/\//g, '_');
    this.selectedInterfaceData = await this.dataService.getInterfaceData(`${interfaceName}-${DEVICE_NAME}`).toPromise();
  }

  async getDetailedRearItemData(item: any) {
    switch (item.type) {
      case 'fan':
        this.selectedRearItemData = await this.dataService.getFanData(`${item.name}-${DEVICE_NAME}`).toPromise();
        break;
      case 'powersupply':
        this.selectedRearItemData = await this.dataService.getPowerSupplyData(`${item.name}-${DEVICE_NAME}`).toPromise();
        break;
      default:
        const itemName = item.name.replace(/\//g, '_');
        this.selectedRearItemData = await this.dataService.getInterfaceData(`${itemName}-${DEVICE_NAME}`).toPromise();
    }
  }

  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  flipBox() {
    this.isFrontPage = !this.isFrontPage;
  }
}
