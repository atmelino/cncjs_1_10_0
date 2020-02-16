import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Modal from 'app/components/Modal';
import ToggleSwitch from 'app/components/ToggleSwitch';
import i18n from 'app/lib/i18n';
import { TRACE, DEBUG, INFO, WARN, ERROR } from 'universal-logger';
import log from '../../lib/log';

class MakeProbeFile extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    render() {
        const { state, actions } = this.props;
        const { startX, endX, useTLO } = state;
        log.setLevel(TRACE);
        log.log(INFO, 'MakeProbeFile :' + JSON.stringify(state));

        const probeDepth = 12;
        const probeCommands = actions.populateProbeCommands();
        //const probeCommands = ['Saab', 'Volvo', 'BMW'];
        const content = probeCommands.join('\n');
        const displayUnits = i18n._('mm');
        const step = 1;

        return (
            <Modal disableOverlay size="sm" onClose={actions.closeModal}>
                <Modal.Header>
                    <Modal.Title>{i18n._('Make Probe File')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ marginBottom: 10 }}>
                        <ToggleSwitch
                            checked={useTLO}
                            size="sm"
                            onChange={actions.toggleUseTLO}
                        />
                        {i18n._('Apply tool length offset')}
                    </div>
                    <div className="row no-gutters">
                        <div className="col-xs-6" style={{ paddingRight: 5 }}>
                            <div className="form-group">
                                <label className="control-label">{i18n._('Start X')}</label>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={startX}
                                        placeholder="0.00"
                                        min={0}
                                        step={step}
                                        onChange={actions.handleProbeDepthChange}
                                    />
                                    <div className="input-group-addon">{displayUnits}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6" style={{ paddingLeft: 5 }}>
                            <div className="form-group">
                                <label className="control-label">{i18n._('End X')}</label>
                                <div className="input-group input-group-sm">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={endX}
                                        placeholder="0.00"
                                        min={0}
                                        step={step}
                                        onChange={actions.handleProbeFeedrateChange}
                                    />
                                    <span className="input-group-addon">{displayUnits}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <pre style={{ minHeight: 240 }}>
                        <code>{content}</code>
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-default"
                        onClick={actions.closeModal}
                    >
                        {i18n._('Cancel')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            actions.closeModal();
                            actions.makeProbeFileCommands(probeCommands);
                        }}
                    >
                        {i18n._('Make File')}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default MakeProbeFile;
