import React, { useState, useEffect } from 'react';
import fossil_data from "./data/fossil.csv";
import { IconButton, Button } from '@fluentui/react/lib/Button';
import { DetailsList, IDetailsRowStyles } from '@fluentui/react/lib/DetailsList';
import { Fabric } from '@fluentui/react/lib/Fabric';
import { Stack } from '@fluentui/react/lib/Stack';
import { TextField } from '@fluentui/react/lib/TextField';
import { Icon } from '@fluentui/react/lib/Icon';
import { SharedColors } from '@uifabric/fluent-theme/lib/fluent/FluentColors';
import fill from 'lodash-es/fill';
import update from 'immutability-helper';
import { isFunction } from 'lodash-es';

interface State {
    my: number[],
    compare?: number[],
}

type Data = typeof fossil_data[0];
const valueStyle: React.CSSProperties = {
    fontWeight: "bold",
}

export default function FossilView() {
    const language = 'kor';
    const [state, setState] = useState<State>(() => {
        const savedState = localStorage.getItem('fossil_data');
        let state: State | undefined = undefined;
        if (savedState) {
            try {
                state = JSON.parse(savedState);
            } catch (e) {
                console.error("Failed to parsed saved data", e);
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
        localStorage.setItem('fossil_data', JSON.stringify(state));
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

    return <Fabric>
        <Stack>
            <TextField label="비교 데이터" defaultValue={compareData} onBlur={(ev) => {
                setState(update(state, {
                    compare: {
                        $set: ev.target.value.split(",").map(v => parseInt(v, 10)),
                    }
                }));
            }} />
            <Stack horizontal>
                <TextField label="내 데이터" readOnly value={myData} />
                <Button title="share" iconProps={{ iconName: 'share' }} onClick={
                    async () => {
                        await navigator.clipboard.writeText(`${location.protocol}//${location.host}${location.pathname}?compare=${myData}`);
                        alert('Copied!');
                    }
                }/>
            </Stack>
            <DetailsList items={fossil_data} columns={[
                {
                    key: 'name',
                    name: '이름',
                    fieldName: language,
                    minWidth: 100,
                    maxWidth: 200,
                },
                {
                    key: 'price',
                    fieldName: 'price',
                    name: '가격',
                    minWidth: 50,
                    maxWidth: 50,
                },
                {
                    key: 'my',
                    name: '소유',
                    minWidth: 50,
                    maxWidth: 100,
                    onRender(_, index) {
                        return <Stack horizontal style={{ width: '100%', verticalAlign: 'middle' }}>
                            <IconButton iconProps={{ iconName: 'Remove' }} title="subtract" onClick={() => setState(
                                update(state, {
                                    my: {
                                        [index!]: (v) => Math.max(v - 1, -1),
                                    },
                                }),
                            )} />
                            {renderCount(state.my[index!])}
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
                    name: '비교',
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
                    if (my === -1 && compare > 0 || my > 0 && compare === -1) {
                        const overrideStyle: Partial<IDetailsRowStyles> = {
                            root: {
                                backgroundColor: SharedColors.cyanBlue10 + 'aa',
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
            compact={true} />
        </Stack>
    </Fabric>
}