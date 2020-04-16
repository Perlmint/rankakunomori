import React, { useState, ReactNode, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import Fossil from './fossil';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import { Stack } from '@fluentui/react/lib/Stack';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { CommandButton } from '@fluentui/react/lib/Button';
import { Depths } from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

initializeIcons();

const AvailableLanguages = ["en", "ko", "ja"];

const cache = createIntlCache();

function Internationlize(props: { children?: ReactNode }) {
    const [language, setLanguage] = useState(localStorage.getItem('language') ?? navigator.language);

    localStorage.setItem('language', language);

    const LoaderComponent = lazy(async () => {
        const message: {[key: string]: string} = await import(`./data/${language}.json`);
        const intl = createIntl({
            locale: language,
            defaultLocale: "en",
            messages: message
        }, cache);

        return {
            default: () => <RawIntlProvider value={intl}>
                <Stack verticalAlign="space-between" tokens={{ childrenGap: 'm' }}>
                    <Stack.Item>
                        <Stack horizontal>
                            <Stack.Item grow={1}>&nbsp;{/* spacing */}</Stack.Item>
                            <Stack.Item>
                                <CommandButton
                                    key='language'
                                    text={intl.formatMessage({ id: "Language" })}
                                    menuProps={{
                                        items: AvailableLanguages.map(v => ({
                                            key: v,
                                            text: intl.formatMessage({ id: v }),
                                            canCheck: true,
                                            checked: language === v,
                                        })),
                                        onItemClick(_, item) {
                                            setLanguage(item!.key as string)
                                        }
                                    }}
                                />
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal>
                            <Stack.Item grow={1}>&nbsp;</Stack.Item>
                            <Stack.Item styles={{ root: { boxShadow: Depths.depth16, minWidth: "50%" } }}>
                                {props.children}
                            </Stack.Item>
                            <Stack.Item grow={1}>&nbsp;</Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
            </RawIntlProvider>,
        }
    });

    return <Suspense fallback={
        <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex"}}>
            <Spinner size={SpinnerSize.large} label="Loading..." labelPosition="top" styles={{ root: { flexGrow: 1 }}} />
        </div>
    }>
        <LoaderComponent />
    </Suspense>
}

ReactDOM.render(<Internationlize><Fossil /></Internationlize>, document.getElementById('app'));