import { line } from "laravel-mix/src/Log"
import DOMInteractions from "./DOMInteractions"

export default class CommandDOMInteractions extends DOMInteractions {

    constructor() {
        super()
        this.indexOfCellsToBeHidden = []
    }

    handleActionsInSimpleModal()
    {
        this.ClickOnCloseModalButton()
    }

    closeModalThenRemoveHisEventListener(e)
    {
        this.findOptionWithSameLineThatCellsInModal()
        this.renderCellsElementsInModalInTheirOriginalParentWithHiddenAttr()
        this.closeModal()
        e.target.removeEventListener('click', this.closeModalThenRemoveHisEventListener)
    }

    findOptionWithSameLineThatCellsInModal()
    {
        this.optionWithSameLineThatCellsInModal
        this.cellsInModal = Array.from(this.modal.querySelectorAll('td'))

        document.querySelectorAll('option').forEach(option => {
            if(option.value === this.cellsInModal[0].classList[1]) {
                this.optionWithSameLineThatCellsInModal = option
            }
        })
    }

    renderCellsElementsInModalInTheirOriginalParentWithHiddenAttr()
    {
        this.cellsInModal.forEach(cellInModal => {
            cellInModal.setAttribute('hidden', 'true')
            let lineCells = Array.from(this.optionWithSameLineThatCellsInModal.parentElement.parentElement.parentElement.querySelectorAll('td'))
            lineCells.forEach(lineCell => {
                if(lineCells.indexOf(lineCell) === this.indexOfCellsToBeHidden[this.cellsInModal.indexOf(cellInModal)]) {
                    lineCell.before(cellInModal)
                }
            })
        })
    }

    fetchModalDeliverStatus()
    {
        return this.modal.querySelector('.deliver-status')
    }
}