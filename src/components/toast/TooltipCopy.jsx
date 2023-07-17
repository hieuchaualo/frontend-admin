import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

function TooltipCopy({
    children,
    contentCopy,
    contentLink,
    contentLinkTooltip,
    className,
}) {
    const [tooltipContentCopy, setTooltipContentCopy] = useState('Copy')

    const copyToClipboard = event => {
        event.stopPropagation()
        // await navigator.clipboard.writeText(contentCopy)
        const textField = document.createElement('textarea')
        textField.innerText = contentCopy
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()

        setTooltipContentCopy('Copied!')
    }

    const openNewTab = () => {
        window.open(contentLink)
    }

    const showTooltipCopy = () => {
        setTooltipContentCopy('Copy to clipboard')
    }

    const hideTooltipCopy = () => {
        setTimeout(() => setTooltipContentCopy('Copy to clipboard'), 120)
    }

    return (
        <span className={'text-third ' + className}>
            {contentCopy && (
                <span
                    className="cooltipz--bottom-left"
                    aria-label={tooltipContentCopy}
                    onMouseEnter={showTooltipCopy}
                    onMouseLeave={hideTooltipCopy}
                >
                    <FontAwesomeIcon
                        icon={faCopy}
                        onClick={copyToClipboard}
                        className='text-secondary'
                    /> { }
                </span>
            )}
            {contentLink
                ? (<span
                    className="cooltipz--bottom"
                    aria-label={contentLinkTooltip || 'View in explorer'}
                    onClick={openNewTab}
                >
                    {children}
                </span>)
                : children
            }
        </span>
    )
}

export { TooltipCopy }
