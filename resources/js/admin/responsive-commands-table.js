import { isEmpty, isInteger } from "lodash"
import { post } from "../ajax"
import { elementContainsClassname, makeArray, makeInchangeableArray } from "../Functions/Tools"


export default class ResponsiveCommandsTable {
    /**
     * 
     * @param {domInteractionsInteractions} domInteractionsInteractions 
     */
    constructor(domInteractionsInteractions)
    {
        this.domInteractions = domInteractionsInteractions
        this.isMobile = true
        this.table = document.querySelector('table')
        this.tableBodyLines = [].slice.call(this.table.querySelectorAll('tbody tr'))
        this.CellsCorrespondingToSelectedOptionIndexedByLineIndex = {}
        this.toHideHeadCellsIndex = []
        this.tableDeliverStatus = this.table.querySelectorAll('.deliver-status')
    }

    handleResize()
    {
        let mobile = window.innerWidth < 600
        this.isMobile = mobile
        
        if(this.isMobile) {
            this.showOnlyUsernameAndDate()
            this.createHeaderCellForHotDogMenu()
            this.createHotDogMenuInLine()
        }else {
            this.unhideForMobileHiddenCells()
            this.removeHeaderCellForHotDogMenu()
            this.removeHotDogMenu()
            this.checkEventInDeliveredStatusForDesktop()
            if(this.domInteractions.modalContainer) {
                this.domInteractions.closeModal()
                this.domInteractions.modalContainer = undefined
            }
        }
    }

    showOnlyUsernameAndDate()
    {
        this.tableHeaderLine = this.table.querySelector('.tab-head')
        this.tableHeadCells = [].slice.call(this.tableHeaderLine.querySelectorAll('td'))
        this.tableHeadCells.forEach(cell => {
            if(this.NotHiddenCellIsNotUserAndDate(cell)) {
                this.toHideHeadCellsIndex.push(this.tableHeadCells.indexOf(cell))
                cell.setAttribute('hidden', 'true')
            }
        })

        this.fetchCellsCorrespondingToSelectedOption()
        this.hideCellsCorrespondingToSelectedOption()
    }

    unhideForMobileHiddenCells()
    {
        if(!isEmpty(this.CellsCorrespondingToSelectedOptionIndexedByLineIndex)) {
            this.unhideHiddenHeadCells()
            this.unhideCellsInCellsCorrespondingToHeadCellColumnObj()
        }

        // Vider cette varibale d'instance car elle se reremplira lors du resize en mobile
        this.CellsCorrespondingToSelectedOptionIndexedByLineIndex = {}
    }

    NotHiddenCellIsNotUserAndDate(cell)
    {
        return !cell.hasAttribute('hidden')
            && !elementContainsClassname(cell, 'head_user') && !elementContainsClassname(cell, 'head_commands_dates')
            && !elementContainsClassname(cell, 'header_cell_for_hot_dog_menu')
    }

    hideCellsCorrespondingToSelectedOption()
    {
        this.loopOverCellsCorrespondingToSelectedOption((cell, lineIndex) => {
            if(!elementContainsClassname(cell.parentElement, 'command_data_container')) {
                cell.setAttribute('hidden', 'true') 
             }
        })
    }

    loopOverCellsCorrespondingToSelectedOption(callback)
    {
        for (let lineIndex in this.CellsCorrespondingToSelectedOptionIndexedByLineIndex) {
            this.CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex].forEach(arrayOfCell => {
                arrayOfCell.forEach(cell => {
                    callback(cell, lineIndex)
                })
            })
        }
    }

    fetchCellsCorrespondingToSelectedOption()
    {
        this.tableBodyLines.forEach(line => {
            let lineCells = [].slice.call(line.querySelectorAll('td'))
            let select = line.querySelector('select')
            console.log(select)
            const selectedIndex = select.selectedIndex
            let selectedOption = [].slice.call(select.children)[selectedIndex]
            
            if(this.CellsCorrespondingToSelectedOptionIndexedByLineIndex
                [this.tableBodyLines.indexOf(line)] 
                === undefined
            ){
                this.CellsCorrespondingToSelectedOptionIndexedByLineIndex[this.tableBodyLines.indexOf(line)] = []
            }

            if(this.CellsCorrespondingToSelectedOptionIndexedByLineIndex
                [this.tableBodyLines.indexOf(line)][selectedIndex] 
                === undefined
            ) {
                this.CellsCorrespondingToSelectedOptionIndexedByLineIndex[this.tableBodyLines.indexOf(line)][selectedIndex] = []
            }
            
            lineCells.forEach(cell => {
                if(elementContainsClassname(cell, selectedOption.value) && !cell.hasAttribute('hidden')) {
                    this.domInteractions.indexOfCellsToBeHidden.push(lineCells.indexOf(cell))
                    this.CellsCorrespondingToSelectedOptionIndexedByLineIndex[this.tableBodyLines.indexOf(line)][selectedIndex].push(cell)
                }
            })
        })
    }

    createHeaderCellForHotDogMenu()
    {
        if(this.tableHeaderLine.querySelector('.header_cell_for_hot_dog_menu') === null) {
            let headerCell = this.domInteractions.createElement('td', 'header_cell_for_hot_dog_menu')
            this.tableHeaderLine.appendChild(headerCell)
        }
        
    }

    createHotDogMenuInLine()
    {
        this.tableBodyLines.forEach(line => {
            if(!this.hotDogMenuExistsInThisLine(line)) {
               this.appendHotDogMenuToLine(line) 
               this.handleActionsOnHotDogMenu(line)
            }
        })
    } 

    hotDogMenuExistsInThisLine(line)
    {
        return line.querySelector('.hot_dog_menu') !== null  
    }
    
    /**
     * 
     * @param {HTMLElement} line 
     */
    appendHotDogMenuToLine(line) {
        let hotDogCell = this.domInteractions.createElement('td', 'hot_dog_menu')
        line.appendChild(hotDogCell)

        for(let circleNumber = 0; circleNumber < 3; circleNumber++) {
            hotDogCell.appendChild(this.domInteractions.createElement('p', 'hot_dog_circle'))
        }  
    }

    /**
     * 
     * @param {HTMLElement} line 
     */
    handleActionsOnHotDogMenu(line)
    {
        this.currenClickedHotdogMenu = line.querySelector('.hot_dog_menu')
        this.currenClickedHotdogMenu.addEventListener('click', this.handleHotdogMenuClick.bind(this))
    }

    handleHotdogMenuClick(e)
    {
        e.stopPropagation()
        e.preventDefault()
        
        this.domInteractions.toggleMenu(e, {
            className: 'table_command_line_menu',
            content: '<p class="see_command_details">Voir les détails</p>',
            appendTo: e.currentTarget
        })

        this.handleActionsInHotDogMenuContent()
        this.domInteractions.hideMenuWhenBodyClick()
    }
    
    handleActionsInHotDogMenuContent()
    {
        document.querySelector('.see_command_details')?.addEventListener('click', (e) => {
            let currentLine = this.currenClickedHotdogMenu.parentElement
            let select = currentLine.querySelector('select')
            let selectedOption = makeInchangeableArray(select.children)[select.selectedIndex]
            const modalContent = this.createModalContentByDataOf(currentLine, selectedOption)
                    
            this.domInteractions.createModal('command_data_modal', modalContent)
            this.domInteractions.handleActionsInModalContent()
            this.checkEventInDeliverStatusOfModal()
        })
    }

    /**
     * 
     * @param {HTMLElement} currentLine 
     * @param {HTMLElement} selectedOption
     * @returns {HTMLElement} containerInsideModal
     */
    createModalContentByDataOf(currentLine, selectedOption)
    {
        let cells = makeArray(currentLine.querySelectorAll('td'))
        this.containerInsideModal = this.domInteractions.createElement('div', 'container')

        this.containerInsideModal.innerHTML = `<i class="fas fa-window-close close-btn"></i>`

        cells.forEach(cell => {
            if(elementContainsClassname(cell, selectedOption.value) ) {
                cell.removeAttribute('hidden')
                this.innerModalContent(cell)
            }
            return
        })

        return this.containerInsideModal
    }

    /**
     * 
     * @param {HTMLElement} cell 
     */
    innerModalContent(cell)
    {
        let commandDataContainer = this.domInteractions.createElement('div', 'command_data_container')
                    
        if(elementContainsClassname(cell, 'command_recipe')) {
            commandDataContainer.innerHTML = '<p>Plat : </p>'
        }else if(elementContainsClassname(cell, 'command_quantity')) {
            commandDataContainer.innerHTML = '<p>Quantité : </p>'
        } else {
            commandDataContainer.innerHTML = '<p>Livré ? : </p>'
        }
                    
        commandDataContainer.appendChild(cell)
        this.containerInsideModal.appendChild(commandDataContainer)
    }

    unhideHiddenHeadCells()
    {
        for(const headCellIndex of this.toHideHeadCellsIndex) {
            this.tableHeadCells[headCellIndex].removeAttribute('hidden')
        }
    }

    unhideCellsInCellsCorrespondingToHeadCellColumnObj()
    {
        for(const lineIndex in this.CellsCorrespondingToSelectedOptionIndexedByLineIndex) {
            this.unhideCellsInTheLine(lineIndex)
        }
    }

    /**
     * 
     * @param {number} lineIndex 
     */
    unhideCellsInTheLine(lineIndex)
    {
        this.CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex].forEach(arrayOfCells => {
            arrayOfCells.forEach(cell => {
                cell.removeAttribute('hidden')
            })
        })
    }

    removeHeaderCellForHotDogMenu()
    {
        let hotDogMenu = this.table.querySelector('.tab-head .header_cell_for_hot_dog_menu')

        if(hotDogMenu !== null) {
            this.tableHeaderLine.removeChild(hotDogMenu)
        }
    }

    removeHotDogMenu()
    {
        this.table.querySelectorAll('.hot_dog_menu').forEach(hotdogMenu => {
            hotdogMenu.parentElement.removeChild(hotdogMenu)
        })
    }

    checkEventInDeliverStatusOfModal()
    {
        let modalDeliveredStatus = this.domInteractions.fetchModalDeliverStatus()

        this.loopOverCellsCorrespondingToSelectedOption((cell, lineIndex) => {
            if(cell.firstElementChild !== null && cell.firstElementChild === modalDeliveredStatus) {
                this.originalLineIndexOfModalDeliverStatus = lineIndex
            }
        })

        this.currentDeliverStatus = modalDeliveredStatus
        modalDeliveredStatus.addEventListener('click', this.handleStatusClick.bind(this))
        modalDeliveredStatus.addEventListener('touchstart', this.handleStatusClick.bind(this))
        
    }
    
    checkEventInDeliveredStatusForDesktop()
    {
        this.tableDeliverStatus.forEach(status => {
            this.currentDeliverStatus = status
            status.addEventListener('click', this.handleStatusClick.bind(this))
        }) 
    }

    handleStatusClick()
    {
        this.changeStatus(this.currentDeliverStatus)
    }

    handleStatusTouch()
    {
        this.changeStatus(this.currentDeliverStatus)
    }

    changeStatus(status)
    {
        let delivered = status.getAttribute('data-delivered')
        
        if(delivered === '0'){
            delivered = '1'
        }else{
            return
        }

        let tr 
        if(this.originalLineIndexOfModalDeliverStatus) {
            tr = this.tableBodyLines[this.originalLineIndexOfModalDeliverStatus]
        }else {
            tr = status.parentElement.parentElement
        }
        
        let token = tr.querySelector('input[name="_token"]')
        let select = tr.querySelector('select')
        const selectedIndex = select.selectedIndex
        let selectedOption = makeInchangeableArray(select.children)[selectedIndex]
        const id = parseInt(selectedOption.value)
        
        this.postChangeToServer('/command/delivered/' + id, {
            "_token": token.value,
            "delivered": parseInt(delivered)
        })
    }

    postChangeToServer(url, data)
    {
        post(url, data).then(res => {
            this.currentDeliverStatus.classList.remove('not-delivered')
            this.currentDeliverStatus.classList.add('delivered')
        }).catch(error => {
            console.error(error)
        })
    } 
}