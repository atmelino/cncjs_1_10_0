import get from 'lodash/get';
import includes from 'lodash/includes';
import mapValues from 'lodash/mapValues';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { TRACE, DEBUG, INFO, WARN, ERROR } from 'universal-logger';
import log from '../../lib/log';
import Space from '../../components/Space';
import Widget from '../../components/Widget';
import controller from '../../lib/controller';
import i18n from '../../lib/i18n';
import { in2mm, mm2in } from '../../lib/units';
import WidgetConfig from '../WidgetConfig';
import AutoLevel from './AutoLevel';
import MakeProbeFile from './MakeProbeFile';
import {
    // Units
    IMPERIAL_UNITS,
    METRIC_UNITS,
    // Grbl
    GRBL,
    // Marlin
    MARLIN,
    // Smoothie
    SMOOTHIE,
    // TinyG
    TINYG,
} from '../../constants';
import {
    MODAL_NONE,
    MODAL_PREVIEW
} from './constants';
import styles from './index.styl';

class AutoLevelWidget extends PureComponent {
    static propTypes = {
        widgetId: PropTypes.string.isRequired,
        onFork: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        sortable: PropTypes.object
    };

    // Public methods
    collapse = () => {
        this.setState({ minimized: true });
    };
    expand = () => {
        this.setState({ minimized: false });
    };

    config = new WidgetConfig(this.props.widgetId);

    state = this.getInitialState();

    actions = {
        toggleFullscreen: () => {
            const { minimized, isFullscreen } = this.state;
            this.setState({
                minimized: isFullscreen ? minimized : false,
                isFullscreen: !isFullscreen
            });
        },
        toggleMinimized: () => {
            const { minimized } = this.state;
            this.setState({ minimized: !minimized });
        },
        openModal: (name = MODAL_NONE, params = {}) => {
            log.setLevel(TRACE);
            log.log(INFO, 'AutoLevel/index.jsx before dialog startX=' + this.state.startX);
            this.setState({
                modal: {
                    name: name,
                    params: params
                }
            });
        },
        closeModal: () => {
            this.setState({
                modal: {
                    name: MODAL_NONE,
                    params: {}
                }
            });
        },
        updateModalParams: (params = {}) => {
            this.setState({
                modal: {
                    ...this.state.modal,
                    params: {
                        ...this.state.modal.params,
                        ...params
                    }
                }
            });
        },
        handleStartXChange: (event) => {
            const startX = event.target.value;
            this.setState({ startX });
        },
        handleEndXChange: (event) => {
            const endX = event.target.value;
            this.setState({ endX });
        },
        handleStartYChange: (event) => {
            const startY = event.target.value;
            this.setState({ startY });
        },
        handleEndYChange: (event) => {
            const endY = event.target.value;
            this.setState({ endY });
        },
        handleStepXChange: (event) => {
            const stepX = event.target.value;
            this.setState({ stepX });
        },
        handleStepYChange: (event) => {
            const stepY = event.target.value;
            this.setState({ stepY });
        },
        makeProbeFileCommands: (commands) => {
            log.setLevel(TRACE);
            //log.log(INFO, 'AutoLevel/index.jsx modal dialog closed, makeProbeFileCommands called');
            //log.log(INFO, 'AutoLevel/index.jsx startX=' + this.state.startX);
            log.log(INFO, 'AutoLevel/index.jsx makeProbeFileCommands:' + JSON.stringify(this.state));
        }
    };

    controllerEvents = {
        // atmelino
        'prbevent': (payload) => {
            //const { mypayload } = payload;
            //this.setState({ payload: payload });
            log.error('AutoLevel Probing prbevent');
        },
        'serialport:read': (received) => {
            if (received.type === 'probing') {
                // atmelino
                //log.error('AutoLevel probing received through serialport:read');
                //log.error('AutoLevel s:r' + JSON.stringify(received));
                this.setState({ probingData: received });
            }
            //const { opt } = received;
        },
        'serialport:open': (options) => {
            const { port } = options;
            this.setState({ port: port });
        },
        'serialport:close': (options) => {
            const initialState = this.getInitialState();
            this.setState({ ...initialState });
        },
        'controller:settings': (type, controllerSettings) => {
            this.setState(state => ({
                controller: {
                    ...state.controller,
                    type: type,
                    settings: controllerSettings
                }
            }));
        },
        'controller:state': (type, controllerState) => {
            // Grbl
            if (type === GRBL) {
                const { status, parserstate } = { ...controllerState };
                const { mpos, wpos } = status;
                const { modal = {} } = { ...parserstate };
                const units = {
                    'G20': IMPERIAL_UNITS,
                    'G21': METRIC_UNITS
                }[modal.units] || this.state.units;
                const $13 = Number(get(controller.settings, 'settings.$13', 0)) || 0;

                let customDistance = this.config.get('jog.customDistance');
                if (units === IMPERIAL_UNITS) {
                    customDistance = mm2in(customDistance).toFixed(4) * 1;
                }
                if (units === METRIC_UNITS) {
                    customDistance = Number(customDistance).toFixed(3) * 1;
                }
                // atmelino
                //log.error('axes controller:state');
                this.setState(state => ({
                    units: units,
                    controller: {
                        ...state.controller,
                        type: type,
                        state: controllerState
                    },
                    // Machine position are reported in mm ($13=0) or inches ($13=1)
                    machinePosition: mapValues({
                        ...state.machinePosition,
                        ...mpos
                    }, (val) => {
                        return ($13 > 0) ? in2mm(val) : val;
                    }),
                    // Work position are reported in mm ($13=0) or inches ($13=1)
                    workPosition: mapValues({
                        ...state.workPosition,
                        ...wpos
                    }, val => {
                        return ($13 > 0) ? in2mm(val) : val;
                    }),
                    customDistance: customDistance
                }));
            }
            // atmelino
            //log.error('AutoLevel Probing controller:state');
        }
    };

    componentDidMount() {
        this.addControllerEvents();
    }
    componentWillUnmount() {
        this.removeControllerEvents();
    }
    componentDidUpdate(prevProps, prevState) {
        const {
            minimized
        } = this.state;

        this.config.set('minimized', minimized);
    }
    getInitialState() {
        return {
            minimized: this.config.get('minimized', false),
            isFullscreen: false,
            canClick: true, // Defaults to true
            port: controller.port,
            controller: {
                type: controller.type,
                settings: controller.settings,
                state: controller.state
            },
            modal: {
                name: MODAL_NONE,
                params: {}
            },
            startX: 3,
            endX: 100,
            startY: 2,
            endY: 98,
            stepX: 10,
            stepY: 10
        };
    }

    addControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            controller.addListener(eventName, callback);
            //log.error('AutoLevel Probing addControllerEvents');
        });
    }

    removeControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            controller.removeListener(eventName, callback);
        });
    }

    canClick() {
        const { port, controller } = this.state;
        const controllerType = controller.type;

        if (!port) {
            return false;
        }
        if (!includes([GRBL, MARLIN, SMOOTHIE, TINYG], controllerType)) {
            return false;
        }
        return true;
    }

    render() {
        const { widgetId } = this.props;
        const { minimized, isFullscreen } = this.state;
        const isForkedWidget = widgetId.match(/\w+:[\w\-]+/);
        const state = {
            ...this.state,
            canClick: this.canClick()
        };
        const actions = {
            ...this.actions
        };

        return (
            <Widget fullscreen={isFullscreen}>
                <Widget.Header>
                    <Widget.Title>
                        <Widget.Sortable className={this.props.sortable.handleClassName}>
                            <i className="fa fa-bars" />
                            <Space width="8" />
                        </Widget.Sortable>
                        {isForkedWidget &&
                            <i className="fa fa-code-fork" style={{ marginRight: 5 }} />
                        }
                        {i18n._('AutoLevel')}
                    </Widget.Title>
                    <Widget.Controls className={this.props.sortable.filterClassName}>
                        <Widget.Button
                            disabled={isFullscreen}
                            title={minimized ? i18n._('Expand') : i18n._('Collapse')}
                            onClick={actions.toggleMinimized}
                        >
                            <i
                                className={classNames(
                                    'fa',
                                    { 'fa-chevron-up': !minimized },
                                    { 'fa-chevron-down': minimized }
                                )}
                            />
                        </Widget.Button>
                        <Widget.DropdownButton
                            title={i18n._('More')}
                            toggle={<i className="fa fa-ellipsis-v" />}
                            onSelect={(eventKey) => {
                                if (eventKey === 'fullscreen') {
                                    actions.toggleFullscreen();
                                } else if (eventKey === 'fork') {
                                    this.props.onFork();
                                } else if (eventKey === 'remove') {
                                    this.props.onRemove();
                                }
                            }}
                        >
                            <Widget.DropdownMenuItem eventKey="fullscreen">
                                <i
                                    className={classNames(
                                        'fa',
                                        'fa-fw',
                                        { 'fa-expand': !isFullscreen },
                                        { 'fa-compress': isFullscreen }
                                    )}
                                />
                                <Space width="4" />
                                {!isFullscreen ? i18n._('Enter Full Screen') : i18n._('Exit Full Screen')}
                            </Widget.DropdownMenuItem>
                            <Widget.DropdownMenuItem eventKey="fork">
                                <i className="fa fa-fw fa-code-fork" />
                                <Space width="4" />
                                {i18n._('Fork Widget')}
                            </Widget.DropdownMenuItem>
                            <Widget.DropdownMenuItem eventKey="remove">
                                <i className="fa fa-fw fa-times" />
                                <Space width="4" />
                                {i18n._('Remove Widget')}
                            </Widget.DropdownMenuItem>
                        </Widget.DropdownButton>
                    </Widget.Controls>
                </Widget.Header>
                <Widget.Content
                    className={classNames(
                        styles.widgetContent,
                        { [styles.hidden]: minimized }
                    )}
                >
                    {state.modal.name === MODAL_PREVIEW &&
                        <MakeProbeFile state={state} actions={actions} />
                    }
                    <AutoLevel
                        state={state}
                        actions={actions}
                    />
                </Widget.Content>
            </Widget>
        );
    }
}

export default AutoLevelWidget;
