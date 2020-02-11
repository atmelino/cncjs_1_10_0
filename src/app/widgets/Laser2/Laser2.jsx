import _ from 'lodash';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Panel from 'app/components/Panel';
import Toggler from 'app/components/Toggler';
import RepeatButton from 'app/components/RepeatButton';
import controller from 'app/lib/controller';
import i18n from 'app/lib/i18n';
import {
    // Grbl
    GRBL,
    // Marlin
    MARLIN,
    // Smoothie
    SMOOTHIE,
    // TinyG
    TINYG
} from '../../constants';
import styles from './index.styl';

class Laser2 extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };


    render() {
        const { state, actions } = this.props;
        const none = '–';
        const { canClick, panel, test } = state;

        return (
            <div>
                <div className="form-group">
                    <div className="row no-gutters">
                        <div className="col-xs-9">
                            <div className={styles.droBtnGroup}>
                                <div className="btn-group btn-group-sm" role="group">
                                    <RepeatButton
                                        className="btn btn-default"
                                        style={{ padding: 5 }}
                                        disabled={!canClick}
                                        onClick={() => {
                                            controller.command('spindleOverride', -10);
                                        }}
                                    >
                                        <i className="fa fa-arrow-down" style={{ fontSize: 14 }} />
                                        <span style={{ marginLeft: 5 }}>
                                            -10%
                                        </span>
                                    </RepeatButton>
                                    <RepeatButton
                                        className="btn btn-default"
                                        style={{ padding: 5 }}
                                        disabled={!canClick}
                                        onClick={() => {
                                            controller.command('spindleOverride', -1);
                                        }}
                                    >
                                        <i className="fa fa-arrow-down" style={{ fontSize: 10 }} />
                                        <span style={{ marginLeft: 5 }}>
                                            -1%
                                        </span>
                                    </RepeatButton>
                                    <RepeatButton
                                        className="btn btn-default"
                                        style={{ padding: 5 }}
                                        disabled={!canClick}
                                        onClick={() => {
                                            controller.command('spindleOverride', 1);
                                        }}
                                    >
                                        <i className="fa fa-arrow-up" style={{ fontSize: 10 }} />
                                        <span style={{ marginLeft: 5 }}>
                                            1%
                                        </span>
                                    </RepeatButton>
                                    <RepeatButton
                                        className="btn btn-default"
                                        style={{ padding: 5 }}
                                        disabled={!canClick}
                                        onClick={() => {
                                            controller.command('spindleOverride', 10);
                                        }}
                                    >
                                        <i className="fa fa-arrow-up" style={{ fontSize: 14 }} />
                                        <span style={{ marginLeft: 5 }}>
                                            10%
                                        </span>
                                    </RepeatButton>
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        style={{ padding: 5 }}
                                        disabled={!canClick}
                                        onClick={() => {
                                            controller.command('spindleOverride', 0);
                                        }}
                                    >
                                        <i className="fa fa-undo fa-fw" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Laser2;
