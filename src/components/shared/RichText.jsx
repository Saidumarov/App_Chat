import { useCallback, useEffect, useRef } from 'react'
import { FaListOl, FaListUl } from 'react-icons/fa6'

export const RichText = ({ field, control, hasError, lang }) => {
    const editorRef = useRef(null)
    const isComposingRef = useRef(false)

    // ===== 1. CURSOR POZITSIYASINI CHAR OFFSET SIFATIDA SAQLASH =====
    const saveSelection = useCallback(() => {
        const editor = editorRef.current
        if (!editor) return null

        const selection = window.getSelection()
        if (!selection.rangeCount) return null

        const range = selection.getRangeAt(0)
        const preSelectionRange = range.cloneRange()
        preSelectionRange.selectNodeContents(editor)
        preSelectionRange.setEnd(range.startContainer, range.startOffset)

        const start = preSelectionRange.toString().length

        return {
            start: start,
            end: start + range.toString().length,
        }
    }, [])

    // ===== 2. CHAR OFFSET DAN CURSOR RESTORE =====
    const restoreSelection = useCallback((savedSel) => {
        if (!savedSel) return

        const editor = editorRef.current
        if (!editor) return

        let charIndex = 0
        const range = document.createRange()
        range.setStart(editor, 0)
        range.collapse(true)

        const nodeStack = [editor]
        let node
        let foundStart = false
        let stop = false

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                // Text node
                const nextCharIndex = charIndex + node.length

                if (
                    !foundStart &&
                    savedSel.start >= charIndex &&
                    savedSel.start <= nextCharIndex
                ) {
                    range.setStart(node, savedSel.start - charIndex)
                    foundStart = true
                }

                if (
                    foundStart &&
                    savedSel.end >= charIndex &&
                    savedSel.end <= nextCharIndex
                ) {
                    range.setEnd(node, savedSel.end - charIndex)
                    stop = true
                }

                charIndex = nextCharIndex
            } else {
                let i = node.childNodes.length
                while (i--) {
                    nodeStack.push(node.childNodes[i])
                }
            }
        }

        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
    }, [])

    // ===== 3. INPUT HANDLER - CURSOR POZITSIYASINI SAQLAB QOLISH =====
    const handleInput = useCallback(() => {
        if (isComposingRef.current) return

        const editor = editorRef.current
        if (!editor) return

        // Content ni olish
        const content = editor.innerHTML

        // React state ni yangilash
        field.onChange(content)
    }, [field])

    // ===== 4. INLINE FORMAT - FAQAT SELECTION GA =====
    const applyInlineFormat = useCallback(
        (command) => {
            const editor = editorRef.current
            if (!editor) return

            editor.focus()

            const selection = window.getSelection()
            if (!selection.rangeCount) return

            // Selection borligini tekshirish
            const range = selection.getRangeAt(0)

            // Agar text belgilanmagan bo'lsa, hech narsa qilmaydi
            if (range.collapsed) {
                return
            }

            // Selection ni saqlash
            const savedSelection = saveSelection()

            // Format qo'llash
            document.execCommand(command, false, null)

            // Content yangilash
            const content = editor.innerHTML
            field.onChange(content)

            // Selection ni qaytarish
            setTimeout(() => {
                if (savedSelection) {
                    restoreSelection(savedSelection)
                }
            }, 0)
        },
        [field, saveSelection, restoreSelection]
    )

    // ===== 5. BLOCK FORMAT - FAQAT HOZIRGI BLOCK =====
    const applyBlockFormat = useCallback(
        (tag) => {
            const editor = editorRef.current
            if (!editor) return

            editor.focus()

            const selection = window.getSelection()
            if (!selection.rangeCount) return

            const savedSelection = saveSelection()
            const range = selection.getRangeAt(0)

            // Hozirgi block ni topish
            let blockElement = range.commonAncestorContainer

            if (blockElement.nodeType === 3) {
                blockElement = blockElement.parentNode
            }

            while (blockElement && blockElement !== editor) {
                const tagName = blockElement.tagName?.toLowerCase()
                if (
                    ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'].includes(
                        tagName
                    )
                ) {
                    break
                }
                blockElement = blockElement.parentNode
            }

            if (blockElement && blockElement !== editor) {
                // Block ni almashtirish
                const newBlock = document.createElement(tag)
                newBlock.innerHTML = blockElement.innerHTML

                // Style va classlarni ko'chirish
                if (blockElement.style.cssText) {
                    newBlock.style.cssText = blockElement.style.cssText
                }
                if (blockElement.className) {
                    newBlock.className = blockElement.className
                }

                blockElement.parentNode.replaceChild(newBlock, blockElement)
            } else {
                // Yangi block yaratish
                document.execCommand('formatBlock', false, tag)
            }

            const content = editor.innerHTML
            field.onChange(content)

            setTimeout(() => {
                if (savedSelection) {
                    restoreSelection(savedSelection)
                }
            }, 0)
        },
        [field, saveSelection, restoreSelection]
    )

    // ===== 6. LIST FORMAT =====
    const applyListFormat = useCallback(
        (command) => {
            const editor = editorRef.current
            if (!editor) return

            editor.focus()

            const savedSelection = saveSelection()

            document.execCommand(command, false, null)

            const content = editor.innerHTML
            field.onChange(content)

            setTimeout(() => {
                if (savedSelection) {
                    restoreSelection(savedSelection)
                }
            }, 0)
        },
        [field, saveSelection, restoreSelection]
    )

    // ===== 7. TEXT ALIGN =====
    const applyTextAlign = useCallback(
        (alignment) => {
            const editor = editorRef.current
            if (!editor) return

            editor.focus()

            const savedSelection = saveSelection()

            const alignCommands = {
                left: 'justifyLeft',
                center: 'justifyCenter',
                right: 'justifyRight',
            }

            document.execCommand(alignCommands[alignment], false, null)

            const content = editor.innerHTML
            field.onChange(content)

            setTimeout(() => {
                if (savedSelection) {
                    restoreSelection(savedSelection)
                }
            }, 0)
        },
        [field, saveSelection, restoreSelection]
    )

    // ===== 8. PASTE HANDLER =====
    const handlePaste = useCallback(
        (e) => {
            e.preventDefault()

            const text = e.clipboardData.getData('text/plain')
            const selection = window.getSelection()

            if (!selection.rangeCount) return

            const range = selection.getRangeAt(0)
            range.deleteContents()

            const textNode = document.createTextNode(text)
            range.insertNode(textNode)

            // Cursor ni text oxiriga qo'yish
            range.setStartAfter(textNode)
            range.collapse(true)

            selection.removeAllRanges()
            selection.addRange(range)

            // Content yangilash
            const editor = editorRef.current
            if (editor) {
                field.onChange(editor.innerHTML)
            }
        },
        [field]
    )

    // ===== 9. KEYDOWN HANDLER - ENTER =====
    const handleKeyDown = useCallback(
        (e) => {
            // Enter tugmasi
            if (e.key === 'Enter' && !e.shiftKey) {
                const editor = editorRef.current
                if (!editor) return

                const selection = window.getSelection()
                if (!selection.rangeCount) return

                // Agar list ichida bo'lsa, default behavior ishlasin
                const range = selection.getRangeAt(0)
                let listCheck = range.commonAncestorContainer
                if (listCheck.nodeType === 3) listCheck = listCheck.parentNode

                while (listCheck && listCheck !== editor) {
                    if (
                        ['ul', 'ol', 'li'].includes(
                            listCheck.tagName?.toLowerCase()
                        )
                    ) {
                        return // List uchun default behavior
                    }
                    listCheck = listCheck.parentNode
                }

                // Default behavior ni to'xtatish
                e.preventDefault()

                // Hozirgi block ni topish
                let currentBlock = range.startContainer
                if (currentBlock.nodeType === 3) {
                    currentBlock = currentBlock.parentNode
                }

                while (currentBlock && currentBlock !== editor) {
                    const tagName = currentBlock.tagName?.toLowerCase()
                    if (
                        [
                            'p',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'div',
                        ].includes(tagName)
                    ) {
                        break
                    }
                    currentBlock = currentBlock.parentNode
                }

                // Agar block topilmasa, editor o'zini ishlatamiz
                if (!currentBlock || currentBlock === editor) {
                    currentBlock = editor
                }

                // Yangi paragraf yaratish
                const newParagraph = document.createElement('p')

                // Cursor pozitsiyasidan keyingi contentni ajratish
                const rangeAfterCursor = range.cloneRange()

                if (currentBlock === editor) {
                    // Agar to'g'ridan-to'g'ri editor ichida bo'lsa
                    rangeAfterCursor.setEndAfter(editor.lastChild || editor)
                } else {
                    rangeAfterCursor.setEndAfter(
                        currentBlock.lastChild || currentBlock
                    )
                }

                const fragmentAfter = rangeAfterCursor.extractContents()

                // Agar keyingi content bo'sh bo'lmasa, yangi paragrafga qo'shamiz
                if (
                    fragmentAfter.textContent.trim() ||
                    fragmentAfter.querySelector('img, br')
                ) {
                    newParagraph.appendChild(fragmentAfter)
                } else {
                    // Bo'sh bo'lsa, <br> qo'yamiz (bo'sh paragraf uchun)
                    newParagraph.innerHTML = '<br>'
                }

                // Yangi paragrafni qo'shish
                if (currentBlock === editor) {
                    editor.appendChild(newParagraph)
                } else {
                    currentBlock.parentNode.insertBefore(
                        newParagraph,
                        currentBlock.nextSibling
                    )
                }

                // Cursor ni yangi paragraf boshiga qo'yish
                const newRange = document.createRange()
                const firstChild = newParagraph.firstChild

                if (firstChild && firstChild.nodeType === 3) {
                    // Text node bo'lsa
                    newRange.setStart(firstChild, 0)
                } else if (firstChild) {
                    // Element bo'lsa
                    newRange.setStartBefore(firstChild)
                } else {
                    // Bo'sh bo'lsa
                    newRange.setStart(newParagraph, 0)
                }

                newRange.collapse(true)

                selection.removeAllRanges()
                selection.addRange(newRange)

                // Content yangilash
                setTimeout(() => {
                    field.onChange(editor.innerHTML)
                }, 0)
            }
        },
        [field]
    )

    // ===== 9. COMPOSITION EVENTS (IME uchun) =====
    const handleCompositionStart = useCallback(() => {
        isComposingRef.current = true
    }, [])

    const handleCompositionEnd = useCallback(() => {
        isComposingRef.current = false
        const editor = editorRef.current
        if (editor) {
            field.onChange(editor.innerHTML)
        }
    }, [field])

    // ===== 10. INITIAL CONTENT =====
    useEffect(() => {
        const editor = editorRef.current
        if (!editor) return

        // Faqat bo'sh bo'lsa yoki focus yo'q bo'lsa yangilash
        const isEditorFocused = document.activeElement === editor

        if (!isEditorFocused && editor.innerHTML !== field.value) {
            editor.innerHTML = field.value || '<p><br></p>'
        }
    }, [field.value])

    // ===== 11. COMPONENT MOUNT - INITIAL CONTENT =====
    useEffect(() => {
        const editor = editorRef.current
        if (!editor) return

        // Initial content
        if (!editor.innerHTML || editor.innerHTML === '') {
            editor.innerHTML = field.value || '<p><br></p>'
        }
    }, [])

    // ===== 12. BUTTON HANDLERS =====
    const createButtonHandler = (handler, ...args) => ({
        onMouseDown: (e) => e.preventDefault(),
        onClick: () => handler(...args),
    })

    // ===== 13. TOOLBAR =====
    const Toolbar = () => (
        <div className="bg-gray-100 justify-between p-2 border-b flex flex-wrap gap-1">
            {/* Inline formats */}
            <button
                type="button"
                {...createButtonHandler(applyInlineFormat, 'bold')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 font-bold transition"
                title="Bold (Ctrl+B)"
            >
                B
            </button>
            <button
                type="button"
                {...createButtonHandler(applyInlineFormat, 'italic')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 italic transition"
                title="Italic (Ctrl+I)"
            >
                I
            </button>
            <button
                type="button"
                {...createButtonHandler(applyInlineFormat, 'underline')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 underline transition"
                title="Underline (Ctrl+U)"
            >
                U
            </button>
            <button
                type="button"
                {...createButtonHandler(applyInlineFormat, 'strikeThrough')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 line-through transition"
                title="Strikethrough"
            >
                S
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Block formats */}
            <button
                type="button"
                {...createButtonHandler(applyBlockFormat, 'h1')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 font-bold  transition"
                title="Heading 1"
            >
                H1
            </button>
            <button
                type="button"
                {...createButtonHandler(applyBlockFormat, 'h2')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 font-bold transition"
                title="Heading 2"
            >
                H2
            </button>
            <button
                type="button"
                {...createButtonHandler(applyBlockFormat, 'h3')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 font-semibold transition"
                title="Heading 3"
            >
                H3
            </button>
            <button
                type="button"
                {...createButtonHandler(applyBlockFormat, 'p')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 transition"
                title="Paragraph"
            >
                P
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
                type="button"
                {...createButtonHandler(applyListFormat, 'insertUnorderedList')}
                className="w-8 h-8  flex items-center justify-center bg-white border rounded-lg hover:bg-gray-200 transition"
                title="Bullet List"
            >
                <FaListUl />
            </button>
            <button
                type="button"
                {...createButtonHandler(applyListFormat, 'insertOrderedList')}
                className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg hover:bg-gray-200 transition"
                title="Numbered List"
            >
                <FaListOl />
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Text alignment */}
            <button
                type="button"
                {...createButtonHandler(applyTextAlign, 'left')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 transition"
                title="Align Left"
            >
                ⬅
            </button>
            <button
                type="button"
                {...createButtonHandler(applyTextAlign, 'center')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 transition"
                title="Align Center"
            >
                ↔
            </button>
            <button
                type="button"
                {...createButtonHandler(applyTextAlign, 'right')}
                className="w-8 h-8 text-[14px] bg-white border rounded-lg hover:bg-gray-200 transition"
                title="Align Right"
            >
                ➡
            </button>
        </div>
    )

    // ===== 14. PLACEHOLDER =====
    const fieldPlaceholder =
        field.placeholder?.[lang] ||
        field.placeholder?.uz ||
        field.placeholder?.ru

    const showPlaceholder =
        !field.value ||
        field.value === '' ||
        field.value === '<br>' ||
        field.value === '<p><br></p>'

    return (
        <div
            className={`border rounded-xl overflow-hidden relative ${
                hasError ? 'border-red-300' : 'border-gray-300'
            }`}
        >
            <Toolbar />

            <div className="relative">
                {/* Placeholder */}
                {fieldPlaceholder && showPlaceholder && (
                    <div className="absolute top-3 left-3 text-gray-400 pointer-events-none z-10">
                        {fieldPlaceholder}
                    </div>
                )}

                {/* Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className={`w-full ui-text p-3 max-sm:!text-[16px] min-h-[150px] max-h-96 overflow-auto focus:outline-none  relative z-20 ${hasError ?'bg-red-50':'bg-white'} `}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                />
            </div>
        </div>
    )
}
