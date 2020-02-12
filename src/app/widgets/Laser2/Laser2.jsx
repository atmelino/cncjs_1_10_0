import _ from 'lodash';
import Slider from 'rc-slider';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Panel from 'app/components/Panel';
import Toggler from 'app/components/Toggler';
import RepeatButton from 'app/components/RepeatButton';
import controller from 'app/lib/controller';
import i18n from 'app/lib/i18n';
import { TRACE, DEBUG, INFO, WARN, ERROR } from 'universal-logger';
import log from '../../lib/log';
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

    clearGrid = () => {
        log.error('ProbingGrid clearGrid');
        // this.setState({
        //     probingObj: [],
        //     probingString: [],
        //     referenceZ: 0.0
        // });
    };

    handleClickSave = () => {
        log.error('ProbingGrid handleClickSave');
        // this.state.probingObj.forEach(el => {
        //     this.state.probingString.push(el.x + ' ' + el.y + ' ' + el.z + '\n');
        // });
        // var element = document.createElement('a');
        // var file = new Blob(this.state.probingString, { type: 'text/plain' });
        // element.href = URL.createObjectURL(file);
        // element.download = 'probedata.rpf';
        // element.click();
    }

    render() {
        const { state, actions } = this.props;
        const none = '–';
        const { canClick, panel, test } = state;

        return (
            <div>
                <div className="form-group">
                    <div className="row no-gutters">
                        <div>
                        </div>
                        <div>
                            <button onClick={this.clearGrid}>Clear</button>
                            <button onClick={this.handleClickSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Laser2;
