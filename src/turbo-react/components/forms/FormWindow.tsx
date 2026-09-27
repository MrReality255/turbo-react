import { useClosingEffect } from '@mrreality255/turbo-react-forms'
import { TButton, TGlass, TLoadingBar, TViewport, TWindow } from '../atoms'
import { TFormButtonAction, TFormButtonProps, TFormWindowProps } from './types'
import { THorizLayout } from '../layout'
import { TControlContainer } from './ControlContainer'
import { useFormContext } from './lib'

export function TFormWindow(p: TFormWindowProps & { isLoading: boolean }) {
    const frm = useFormContext()
    const ceFrm = useClosingEffect({
        delay: 300,
        mode: 'resize',
        initialState: false,
        initialTargetState: true,
    })

    const ceErr = useClosingEffect({
        delay: 200,
        mode: 'resize',
        visible: frm.formEnv.error !== undefined,
    })

    frm.hideMethodRef.current = (orig: () => void) => {
        ceFrm.hide(orig)
    }
    const { title, children, ...containerProps } = p

    return (
        <>
            <TGlass visible backdrop></TGlass>
            <TGlass visible>
                <TViewport
                    centerH
                    centerV
                    width={p.width ?? '640px'}
                    height={p.height ?? '480px'}
                >
                    <TWindow
                        onClose={() => {
                            frm.close()
                        }}
                        fill
                        style={ceFrm.get()}
                        caption={title}
                        palette={'dialog'}
                    >
                        <TGlass visible={p.isLoading} backdrop></TGlass>
                        {ceErr.isVisible ? (
                            <TWindow
                                palette="red"
                                noShadow
                                border="none"
                                innerPadding="none"
                                style={{ ...ceErr.get() }}
                            >
                                {frm.formEnv.error}
                            </TWindow>
                        ) : null}
                        <TViewport
                            rect={{ x: '0em', y: '2em', x2: '0em', y2: '1em' }}
                        >
                            <TControlContainer {...containerProps}>
                                {children}
                            </TControlContainer>
                        </TViewport>
                        <TViewport
                            rect={{ x: '0em', y2: '1em', x2: '0em' }}
                            height="2em"
                        >
                            {p.isLoading ? (
                                <TLoadingBar></TLoadingBar>
                            ) : (
                                <THorizLayout
                                    left={
                                        <>
                                            {createButtons(p.buttonsLeft ?? [])}
                                        </>
                                    }
                                    alignMode="right"
                                >
                                    {createButtons(p.buttonsRight ?? [])}
                                </THorizLayout>
                            )}
                        </TViewport>
                    </TWindow>
                </TViewport>
            </TGlass>
        </>
    )

    function createButtons(btns: TFormButtonProps[]) {
        return btns.map((btn, idx) => (
            <TButton
                {...btn}
                key={btn.id ?? idx}
                onClick={btn.onClick ?? (() => handleButton(btn))}
            >
                {btn.label}
                {btn.children}
            </TButton>
        ))
    }

    function handleButtonAction(action: TFormButtonAction | undefined) {
        if (action === undefined) {
            return
        }

        switch (action) {
            case 'cancel':
                frm.close()
                return
            case 'submit':
                frm.submit()
                return
            default:
                switch (action.type) {
                    case 'submit':
                        frm.submit(action.id, action.submitData)
                        return
                    case 'command':
                        frm.triggerCommand(action)
                        return
                }
        }
    }

    function handleButton(btn: TFormButtonProps) {
        if (typeof btn.action === 'function') {
            const fctResult = btn.action()
            frm.triggerLoading(
                async () => {
                    return await fctResult
                },
                (action) => {
                    handleButtonAction(action)
                }
            )
            return
        }

        handleButtonAction(btn.action)
    }
}
