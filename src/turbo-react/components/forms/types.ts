import {
    TFormCommandRec,
    TFormControlWrapperProps,
    TKey,
} from '@mrreality255/turbo-react-forms'
import {
    TButtonProps,
    TDropDownProps,
    TGroupBoxProps,
    TProgressBarProps,
    TTextBoxProps,
} from '../atoms'

type TRemoveInputProps<R> = Omit<
    R,
    'value' | 'onChange' | 'disabled' | 'readOnly'
>

export type TFormButtonAction =
    | 'submit'
    | 'cancel'
    | (TFormCommandRec & { type: 'command' })
    | { type: 'submit'; id?: TKey; submitData?: unknown }

export type TFormButtonProps = TButtonProps & {
    action?: TFormButtonAction | (() => Promise<TFormButtonAction>)
    id?: string
    label?: string
}

export type TControlWrapperProps = {
    ctrlProps: TFormControlWrapperProps
    renderProps: TControlRenderProps | undefined
    visible: boolean

    children?: React.ReactNode

    onHint: (tr: string | undefined) => string | undefined
}

export type TControlContainerProps = {
    columns?: string
    gap?: string | number
}

export type TFormWindowProps = TControlContainerProps & {
    width?: string
    height?: string
    title?: string
    children?: React.ReactNode
    buttonsLeft?: TFormButtonProps[]
    buttonsRight?: TFormButtonProps[]
}

export type TFormEnvState = {
    error?: string
}

export type TSubformProps = {
    groupBox?: TRemoveInputProps<TGroupBoxProps>
    container?: TControlContainerProps
}

export type TTextBoxFieldProps = TRemoveInputProps<TTextBoxProps>

export type TDropDownFieldProps = TRemoveInputProps<TDropDownProps>

export type TProgressBarFieldProps = TRemoveInputProps<TProgressBarProps>

export type TControlRenderProps = {
    column?: string
    columns?: string
    gap?: string
}
