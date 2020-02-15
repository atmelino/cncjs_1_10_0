import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import i18n from 'app/lib/i18n';
import {
    METRIC_UNITS
} from '../../constants';
import {
    MODAL_PREVIEW
} from './constants';
import styles from './index.styl';

class Probe2 extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    render() {
        const { state, actions } = this.props;
        const {
            canClick,
            units,
            probeAxis,
            probeCommand,
            probeDepth,
            probeFeedrate,
            touchPlateHeight,
            retractionDistance
        } = state;
        const displayUnits = (units === METRIC_UNITS) ? i18n._('mm') : i18n._('in');
        const feedrateUnits = (units === METRIC_UNITS) ? i18n._('mm/min') : i18n._('in/min');
        const step = (units === METRIC_UNITS) ? 1 : 0.1;

        return (
            <div>
                <div className="form-group">
                    <label className="control-label">{i18n._('Probe2 Axis')}</label>
                    <div className="btn-toolbar" role="toolbar" style={{ marginBottom: 5 }}>
                        <div className="btn-group btn-group-sm">
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeAxis === 'Z' }
                                )}
                                title={i18n._('Probe2 Z Axis')}
                                onClick={() => actions.changeProbe2Axis('Z')}
                            >
                                Z
                            </button>
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeAxis === 'X' }
                                )}
                                title={i18n._('Probe2 X Axis')}
                                onClick={() => actions.changeProbe2Axis('X')}
                            >
                                X
                            </button>
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeAxis === 'Y' }
                                )}
                                title={i18n._('Probe2 Y Axis')}
                                onClick={() => actions.changeProbe2Axis('Y')}
                            >
                                Y
                            </button>
                        </div>
                    </div>
                    <p className={styles.probeAxisDescription}>
                        {probeAxis === 'Z' &&
                        <i>{i18n._('Probe2 Z Axis')}</i>
                        }
                        {probeAxis === 'X' &&
                        <i>{i18n._('Probe2 X Axis')}</i>
                        }
                        {probeAxis === 'Y' &&
                        <i>{i18n._('Probe2 Y Axis')}</i>
                        }
                    </p>
                </div>
                <div className="form-group">
                    <label className="control-label">{i18n._('Probe2 Command')}</label>
                    <div className="btn-toolbar" role="toolbar" style={{ marginBottom: 5 }}>
                        <div className="btn-group btn-group-sm">
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeCommand === 'G38.2' }
                                )}
                                title={i18n._('G38.2 probe toward workpiece, stop on contact, signal error if failure')}
                                onClick={() => actions.changeProbe2Command('G38.2')}
                            >
                                G38.2
                            </button>
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeCommand === 'G38.3' }
                                )}
                                title={i18n._('G38.3 probe toward workpiece, stop on contact')}
                                onClick={() => actions.changeProbe2Command('G38.3')}
                            >
                                G38.3
                            </button>
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeCommand === 'G38.4' }
                                )}
                                title={i18n._('G38.4 probe away from workpiece, stop on loss of contact, signal error if failure')}
                                onClick={() => actions.changeProbe2Command('G38.4')}
                            >
                                G38.4
                            </button>
                            <button
                                type="button"
                                className={classNames(
                                    'btn',
                                    'btn-default',
                                    { 'btn-select': probeCommand === 'G38.5' }
                                )}
                                title={i18n._('G38.5 probe away from workpiece, stop on loss of contact')}
                                onClick={() => actions.changeProbe2Command('G38.5')}
                            >
                                G38.5
                            </button>
                        </div>
                    </div>
                    <p className={styles.probeCommandDescription}>
                        {probeCommand === 'G38.2' &&
                        <i>{i18n._('G38.2 probe toward workpiece, stop on contact, signal error if failure')}</i>
                        }
                        {probeCommand === 'G38.3' &&
                        <i>{i18n._('G38.3 probe toward workpiece, stop on contact')}</i>
                        }
                        {probeCommand === 'G38.4' &&
                        <i>{i18n._('G38.4 probe away from workpiece, stop on loss of contact, signal error if failure')}</i>
                        }
                        {probeCommand === 'G38.5' &&
                        <i>{i18n._('G38.5 probe away from workpiece, stop on loss of contact')}</i>
                        }
                    </p>
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Probe2 Depth')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={probeDepth}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleProbe2DepthChange}
                                />
                                <div className="input-group-addon">{displayUnits}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Probe2 Feedrate')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={probeFeedrate}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleProbe2FeedrateChange}
                                />
                                <span className="input-group-addon">{feedrateUnits}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingRight: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Touch Plate Thickness')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={touchPlateHeight}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleTouchPlateHeightChange}
                                />
                                <span className="input-group-addon">{displayUnits}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                        <div className="form-group">
                            <label className="control-label">{i18n._('Retraction Distance')}</label>
                            <div className="input-group input-group-sm">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={retractionDistance}
                                    placeholder="0.00"
                                    min={0}
                                    step={step}
                                    onChange={actions.handleRetractionDistanceChange}
                                />
                                <span className="input-group-addon">{displayUnits}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col-xs-12">
                        <button
                            type="button"
                            className="btn btn-sm btn-default"
                            onClick={() => {
                                actions.openModal(MODAL_PREVIEW);
                            }}
                            disabled={!canClick}
                        >
                            {i18n._('Probe2')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Probe2;
