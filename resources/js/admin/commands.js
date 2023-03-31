import { isInteger } from "lodash"
import ResponsiveCommandsTable from "./responsive-commands-table"
import CommandsDOMInteractions from "../AbstractClasses/CommandsDOMInteractions"
import { elementContainsClassname, hasAttribute, makeInchangeableArray } from "../Functions/Tools"

export default class AdminUserCommandsManagement {

    constructor(){
        this.table = document.querySelector('.admin-table.commands')
        if(this.table !== null) {
            this.numberOfClickOnSelect = 0
            this.domInteractions = new CommandsDOMInteractions()
            this.responsiveCommandsTable = new ResponsiveCommandsTable(this.domInteractions)

            this.showCommandDataAdminWantToSee()

            this.responsiveCommandsTable.handleResize()
            window.addEventListener('resize', this.responsiveCommandsTable.handleResize.bind(this.responsiveCommandsTable))
        } 
    }

    
    showCommandDataAdminWantToSee()
    {
        this.selectElementsInTable = document.querySelectorAll('td select')

        this.selectElementsInTable.forEach(select => {
            select.addEventListener('click', this.handleSelectClick.bind(this))
            this.resetClickOnSelectNb()
        })
        
    }

    /**
     * 
     * @param {Event} e 
     */
    handleSelectClick(e)
    {
        e.preventDefault()
        this.numberOfClickOnSelect++
        this.currentSelect = e.currentTarget

        if(this.secondClickOnSelect()) {
            this.checkSelectedOptionInSelectElement()
            if(this.currentSelectedOption) {
                this.setSelectedOptionSelectedAttributeToTrue()
                this.manageCellsCorrespondingToSelectedOption() 
            } 
        } 
    }

    resetClickOnSelectNb()
    {
        this.numberOfClickOnSelect = 0
    }
    
    secondClickOnSelect()
    {
        return isInteger(this.numberOfClickOnSelect / 2)
    }

    checkSelectedOptionInSelectElement()
    {
        let options = makeInchangeableArray(this.currentSelect.children)
        this.selectedOptionIndex = this.currentSelect.selectedIndex
        
        options.forEach(option => {
            if(this.optionIsSelectedButHasntSelectedAttr(option, options[this.selectedOptionIndex])) {
                this.currentSelectedOption = option         
            }else if(this.optionIsntSelectedButHasSelectedAttr(option, options[this.selectedOptionIndex])) {
                option.removeAttribute('selected')
            } else if(this.optionIsSelectedAndHasSelectedAttr(option, options[this.selectedOptionIndex])) {
                return
            }
        })
    }

    optionIsSelectedButHasntSelectedAttr(option, selectedOption)
    {
        return option === selectedOption && !this.hasSelectedAttribute(option)
    }

    optionIsntSelectedButHasSelectedAttr(option, selectedOption)
    {
        return option !== selectedOption && this.hasSelectedAttribute(option)
    }

    optionIsSelectedAndHasSelectedAttr(option, selectedOption)
    {
        return option === selectedOption && this.hasSelectedAttribute(option)
    }

    hasSelectedAttribute(option)
    {
        return hasAttribute(option, 'selected')
    }
    
    setSelectedOptionSelectedAttributeToTrue()
    {
        this.currentSelectedOption.setAttribute('selected', 'true')
    }

    manageCellsCorrespondingToSelectedOption()
    {
        this.selectedOptionLineElement = this.currentSelectedOption.parentElement.parentElement.parentElement
        let cells = makeInchangeableArray(
            this.selectedOptionLineElement.children
        )

        cells.forEach(cell => {
            this.currentCellCorrespondingToSelectedOption = cell
            if(
                elementContainsClassname(cell, this.currentSelectedOption.value)
                && cell.hasAttribute('hidden')
            ) {
                this.manipulateCellAcordingToScreenType()
                
            }else if(
                this.columnFillsConditionToBeHidden()
            ){
                this.hideColumn()
            }
        })
        
    }

    manipulateCellAcordingToScreenType()
    {
        if(!this.responsiveCommandsTable.isMobile) {
            this.currentCellCorrespondingToSelectedOption.removeAttribute('hidden')
        }else {
            this.pushCellIntoCellsCorrespondingToSelectedOption()
        }
    }

    pushCellIntoCellsCorrespondingToSelectedOption()
    {
        const lineIndex = this.responsiveCommandsTable.tableBodyLines.indexOf(this.selectedOptionLineElement)
        
        if(this.responsiveCommandsTable
            .CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex]
            [this.selectedOptionIndex] 
            === undefined
        ) {
            this.responsiveCommandsTable.CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex] = []
            this.responsiveCommandsTable.CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex][this.selectedOptionIndex] = []
        }else if(this.responsiveCommandsTable
            .CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex]
            [this.selectedOptionIndex].length 
            >= 3
        ) {
            return
        }

        this.responsiveCommandsTable
            .CellsCorrespondingToSelectedOptionIndexedByLineIndex[lineIndex]
            [this.selectedOptionIndex]
            .push(this.currentCellCorrespondingToSelectedOption)
    }

    hideColumn()
    {
        this.currentCellCorrespondingToSelectedOption.setAttribute('hidden', 'true')
    }

    columnFillsConditionToBeHidden()
    {
        return !elementContainsClassname(this.currentCellCorrespondingToSelectedOption, this.currentSelectedOption.value) 
            && (elementContainsClassname(this.currentCellCorrespondingToSelectedOption, 'command_quantity') 
            || elementContainsClassname(this.currentCellCorrespondingToSelectedOption, 'command_recipe')
            || elementContainsClassname(this.currentCellCorrespondingToSelectedOption, 'command_delivered')
            ) &&  !this.currentCellCorrespondingToSelectedOption.hasAttribute('hidden')
    }
    
}