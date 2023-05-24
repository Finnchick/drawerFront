export class Sidebar {
  private selectedType: string
  private menuContainer: HTMLElement

  constructor () {
    this.initSidebar()
  }

  initSidebar (): void {
    this.menuContainer = document.getElementById('sidebar')
    const radios = this.menuContainer.querySelectorAll('input')
    this.selectedType = 'line'

    radios.forEach((radio) => {
      radio.addEventListener('change', (event) => {
        this.selectItem((event.currentTarget as HTMLInputElement).value)
      })
    })
  }

  selectItem (selectedType: string): void {
    this.selectedType = selectedType
  }

  public get getSelectedType (): string {
    return this.selectedType
  }
}
