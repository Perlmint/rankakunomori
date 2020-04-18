import React, { useState, useEffect } from 'react';
import fossil_data from "./data/fossil.csv";
import { IconButton, Button } from '@fluentui/react/lib/Button';
import { DetailsList, IDetailsRowStyles, CheckboxVisibility, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { Fabric } from '@fluentui/react/lib/Fabric';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { Icon } from '@fluentui/react/lib/Icon';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { SharedColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import { useId } from '@uifabric/react-hooks';
import fill from 'lodash-es/fill';
import update from 'immutability-helper';
import isFunction from 'lodash-es/isFunction';
import { useIntl, FormattedMessage } from 'react-intl';

interface State {
    my: number[],
    compare?: number[],
}

const valueStyle: React.CSSProperties = {
    fontWeight: "bold",
}

export default function FossilView() {
    const usageLayerHostId = useId('usage_layer');
    const intl = useIntl();
    const [state, setState] = useState<State>(() => {
        const savedState = localStorage.getItem('fossil_data');
        let state: State | undefined = undefined;
        if (savedState) {
            try {
                state = JSON.parse(savedState);
            } catch (e) {
                console.error(intl.formatMessage({ id: "Failed to parsed input data" }), e);
            }
        }
        if (state === undefined) {
            state = {
                my: fill(new Array(fossil_data.length), -1),
            };
        }
        for (const q of location.search.substring(1).split('&')) {
            const idx = q.indexOf('=');
            if (q.substring(0, idx) === 'compare') {
                state.compare = q.substring(idx + 1).split(',').map(v => parseInt(v, 10));
            }
        }

        return state;
    });
    useEffect(() => {
        localStorage.setItem('fossil_data', JSON.stringify({ my: state.my }));
    });
    const compareData = state.compare?.join(",") ?? "";
    const myData = state.my.join(",");

    function renderCount(value: number) {
        if (value === -1) {
            return <Icon iconName="Cancel" style={{ color: SharedColors.red20, ...valueStyle }} />;
        } else if (value === 0) {
            return <Icon iconName="CheckMark" style={{ color: SharedColors.greenCyan10, ...valueStyle }} />;
        } else {
            return value.toString(10);
        }
    }

    function createURLWithCompareData(data: string) {
        return `${location.protocol}//${location.host}${location.pathname}?compare=${data}`;
    }

    return <Fabric>
        <Stack tokens={{ padding: 'm' }}>
            <FormattedMessage id="Fossils" tagName="h2" />
            <Stack horizontal>
                <Stack.Item grow={1}>
                    <TextField label={intl.formatMessage({ id: "Data to compare"})} defaultValue={compareData} onBlur={(ev) => {
                        try {
                            const data = ev.target.value.split(",").map(v => parseInt(v, 10));
                            setState(update(state, {
                                compare: {
                                    $set: data,
                                }
                            }));
                            history.replaceState(undefined, document.title, createURLWithCompareData(ev.target.value));
                        } catch (e) {
                            alert(intl.formatMessage({ id: "Failed to parsed input data" }));
                        }
                    }} />
                </Stack.Item>
                <Stack.Item grow={1}>
                    <TextField label={intl.formatMessage({ id: 'My data' })} defaultValue={myData}  onBlur={(ev) => {
                        try {
                            const data = ev.target.value.split(",").map(v => parseInt(v, 10));
                            setState(update(state, {
                                my: {
                                    $set: data,
                                }
                            }));
                        } catch (e) {
                            alert(intl.formatMessage({ id: "Failed to parsed input data" }));
                        }
                    }}/>
                </Stack.Item>
                <Stack.Item>
                    <Button title="share" iconProps={{ iconName: 'share' }} onClick={
                        async () => {
                            await navigator.clipboard.writeText(createURLWithCompareData(myData));
                            alert(intl.formatMessage({ id: 'Copied! Share copied URL' }));
                        }
                    } style={{ height: '100%'}}/>
                </Stack.Item>
            </Stack>
            <MessageBar messageBarType={MessageBarType.info} title={intl.formatMessage({ id: 'Usage' })} styles={{ root: { marginTop: 12} }}>
                {intl.formatMessage({ id: 'fossil.usage.default' }, {
                    x: <Icon iconName="Cancel" style={{ color: SharedColors.red20, ...valueStyle }} />,
                    check: <Icon iconName="CheckMark" style={{ color: SharedColors.greenCyan10, ...valueStyle }} />,
                    number: <Icon iconName="NumberSymbol" />,
                })}
            </MessageBar>
            <MessageBar messageBarType={MessageBarType.info} title={intl.formatMessage({ id: 'Usage' })} styles={{ root: { marginTop: 12} }}>
                {intl.formatMessage({ id: 'fossil.usage.comparison' }, {
                    blue: <Icon iconName="ToggleFilled" style={{ color: SharedColors.cyanBlue10, ...valueStyle }} />,
                    red: <Icon iconName="ToggleFilled" style={{ color: SharedColors.redOrange10, ...valueStyle }} />,
                })}
            </MessageBar>
            <DetailsList items={fossil_data} columns={[
                {
                    key: 'name',
                    name: intl.formatMessage({ id: "Name" }),
                    fieldName: intl.locale,
                    minWidth: 100,
                    maxWidth: 200,
                },
                {
                    key: 'price',
                    fieldName: 'price',
                    name: intl.formatMessage({ id: "Price" }),
                    minWidth: 50,
                    maxWidth: 50,
                },
                {
                    key: 'my',
                    name: intl.formatMessage({ id: "My" }),
                    minWidth: 80,
                    maxWidth: 120,
                    onRender(_, index) {
                        return <Stack horizontal style={{ width: '100%', verticalAlign: 'middle' }}>
                            <IconButton iconProps={{ iconName: 'Remove' }} title="subtract" onClick={() => setState(
                                update(state, {
                                    my: {
                                        [index!]: (v) => Math.max(v - 1, -1),
                                    },
                                }),
                            )} />
                            <Stack.Item grow={1} styles={{ root: { display: 'flex' }}}>
                                <div style={{ textAlign: 'center', margin: 'auto' }}>
                                    {renderCount(state.my[index!])}
                                </div>
                            </Stack.Item>
                            <IconButton iconProps={{ iconName: 'Add' }} title="add" onClick={() => setState(
                                update(state, {
                                    my: {
                                        [index!]: (v) => v + 1,
                                    },
                                }),
                            )} />
                        </Stack>;
                    }
                },
                {
                    key: 'comapre',
                    name: intl.formatMessage({ id: "Compare" }),
                    minWidth: 50,
                    maxWidth: 50,
                    onRender(_, index) {
                        if (state.compare) {
                            return renderCount(state.compare[index!]);
                        } else {
                            return "";
                        }
                    }
                },
            ]}
            onRenderRow={(props, render) => {
                if (!props || !render) {
                    return null;
                }
                if (state.compare) {
                    const my = state.my[props.itemIndex];
                    const compare = state.compare[props.itemIndex];
                    let rowColor: string | undefined = undefined;
                    if (my > 0 && compare === -1) {
                        rowColor = SharedColors.cyanBlue10;
                    } else if (my === -1 && compare > 0) {
                        rowColor = SharedColors.redOrange10;
                    }

                    if (rowColor !== undefined) {
                        const overrideStyle: Partial<IDetailsRowStyles> = {
                            root: {
                                backgroundColor: rowColor + 'aa',
                            },
                        };
                        if (isFunction(props.styles)) {
                            const oldFn = props.styles;
                            props.styles = (st) => Object.assign(oldFn(st), overrideStyle);
                        } else {
                            props.styles = Object.assign(props.styles??{}, overrideStyle);
                        }
                    }
                }
                return render(props);
            }}
            checkboxVisibility={CheckboxVisibility.hidden}
            selectionMode={SelectionMode.none}
            compact={true} />
        </Stack>
    </Fabric>
}