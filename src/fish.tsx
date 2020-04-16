import React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from '@fluentui/react/lib/DetailsList';
import { Fabric } from '@fluentui/react/lib/Fabric';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IContextualMenuProps, IContextualMenuItem, DirectionalHint, ContextualMenu } from '@fluentui/react/lib/ContextualMenu';
import data, { Habitat, Month, Size } from './data/fish';
import { range, fromPairs, every, map, filter, isEqual } from 'lodash-es';
import update, { Spec, CustomCommands } from 'immutability-helper';

type FishData = typeof data[0];

interface Filter {
    month_filter: {[month in Month]: boolean};
    size_filter: {[size in Size]: boolean};
    habitat_filter: {[habitat in Habitat]: boolean};
}

interface State extends Filter {
    showing_items: typeof data,
    contextual_menu?: [string, IContextualMenuProps];
}

function month_range_to_string(range: [Month, Month]) {
    if (isEqual(range, [1, 12])) {
        return '1년 내내';
    }
    if (range[0] === range[1]) {
        return `${range[0]}월`;
    }
    return `${range[0]}월 ~ ${range[1]}월`;
}

function time_range_to_string(range: [number, number]) {
    if (isEqual(range, [0, 23])) {
        return '하루 종일';
    }
    return `${range[0]}시 ~ ${range[1]}시`;
}

function time_ranges_to_string(ranges: [number, number][]) {
    return ranges.map((range, idx) => <span key={idx}>{time_range_to_string(range)}</span>);
}

export default class FishList extends React.Component<{}, State> {
    constructor(props: {}, context: any) {
        super(props, context);

        const current_month = (new Date()).getMonth() + 1;

        const filter: Filter = {
            month_filter: fromPairs(range(1, 13).map(v => [v as Month, v == current_month])) as {[month in Month]: boolean},
            size_filter: fromPairs(range(1, 6).map(v => [v as Size, true])) as {[size in Size]: boolean},
            habitat_filter: fromPairs(range(0, 5).map(v => [v as Habitat, true])) as {[habitat in Habitat]: boolean},
        };

        this.state = {
            showing_items: this.filteredItems(filter),
            ...filter,
        };
    }

    private filteredItems(filter: Filter) {
        return data.filter(item => {
            if (!filter.size_filter[item.size]) {
                return false;
            }
            if (!filter.habitat_filter[item.habitat]) {
                return false;
            }

            for (const month_range of item.living_months) {
                let end_range = month_range[1];
                if (month_range[0] > end_range) {
                    end_range += 12;
                }
                for (let month = month_range[0]; month <= end_range; month++) {
                    if (filter.month_filter[(month % 12) as Month]) {
                        return true;
                    }
                }
            }

            return false;
        });
    }

    private updateFilter(updater: (state: Readonly<State>) => Readonly<State>) {
        this.setState(state => {
            const new_state = updater(state);

            return update(new_state, {
                showing_items: {
                    $set: this.filteredItems(new_state),
                },
            });
        });
    }

    private dismissContextualMenu() {
        this.setState({
            contextual_menu: undefined,
        });
    }

    private buildContextualMenuItems(key: string) {
        let items: IContextualMenuItem[] | undefined = undefined;

        switch (key) {
            case "living_months":
                items = map(this.state.month_filter, (val, month) => ({
                    key: `${month}month`,
                    text: `${month}월`,
                    canCheck: true,
                    checked: val,
                    onClick: () => this.updateFilter(st => update(st, {
                        month_filter: {
                            $toggle: [parseInt(month) as Month],
                        },
                    })),
                }));
                break;
            case "habitat":
                items = map(this.state.habitat_filter, (val, habitat) => {
                    const habitat_e = parseInt(habitat) as Habitat;
                    return {
                        key: `${habitat}`,
                        text: Habitat.toString(habitat_e),
                        canCheck: true,
                        checked: val,
                        onClick: () => this.updateFilter(st => update(st, {
                            habitat_filter: {
                                $toggle: [habitat_e],
                            },
                        })),
                    };
                });
                break;
            case "size":
                items = map(this.state.size_filter, (val, size) => {
                    const size_e = parseInt(size) as Size;
                    return {
                        key: `${size}`,
                        text: Size.toString(size_e),
                        canCheck: true,
                        checked: val,
                        onClick: () => this.updateFilter(st => update(st, {
                            size_filter: {
                                $toggle: [size_e],
                            },
                        })),
                    };
                });
                break;
        }

        return items;
    }

    private openContextMenu(target: HTMLElement, column: IColumn) {
        const items = this.buildContextualMenuItems(column.key);
        if (items) {
            this.setState({
                contextual_menu: [column.key, {
                    items,
                    target,
                    onDismiss: () => this.dismissContextualMenu(),
                }],
            });
        }
    }

    public render() {
        return <Fabric>
            <DetailsList items={this.state.showing_items} onColumnHeaderClick={(ev, column) => ev && column && this.openContextMenu(ev.target as HTMLElement, column)} columns={[
                {
                    key: 'name',
                    name: '이름',
                    minWidth: 100,
                    maxWidth: 100,
                    onRender(item: FishData) {
                        return item.name;
                    }
                },
                {
                    key: 'living_months',
                    name: '출현 기간',
                    minWidth: 100,
                    maxWidth: 100,
                    isFiltered: !every(this.state.month_filter),
                    onRender(item: FishData) {
                        return item.living_months.map(val => <div>{month_range_to_string(val)}</div>);
                    }
                },
                {
                    key: 'appear_time',
                    name: '출현 시간',
                    minWidth: 100,
                    maxWidth: 150,
                    onRender(item: FishData) {
                        const is_single_range = item.appear_time.length == 1;
                        return item.appear_time.map(
                            (ranges, idx) => <div>{time_ranges_to_string(ranges)}{!is_single_range ? `(${month_range_to_string(item.living_months[idx])})` : ''}</div>
                        );
                    }
                },
                {
                    key: 'habitat',
                    name: '출현 장소',
                    minWidth: 100,
                    maxWidth: 100,
                    onRender(item: FishData) {
                        return Habitat.toString(item.habitat);
                    }
                },
                {
                    key: 'size',
                    name: '크기',
                    minWidth: 100,
                    maxWidth: 100,
                    onRender(item: FishData) {
                        return Size.toString(item.size);
                    }
                },
                {
                    key: 'price',
                    name: '가격',
                    minWidth: 100,
                    maxWidth: 100,
                    onRender(item: FishData) {
                        return item.price;
                    }
                },
            ]} compact={true} />
            {this.state.contextual_menu && <ContextualMenu {...this.state.contextual_menu[1]} />}
        </Fabric>;
    }
}