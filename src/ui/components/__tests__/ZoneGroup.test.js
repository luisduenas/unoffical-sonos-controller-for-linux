import React from 'react';
import { ZoneGroup } from '../ZoneGroup';
import ZoneGroupPlayState from '../ZoneGroupPlayState';
import { mount } from 'enzyme';

jest.mock('../ZoneGroupMember', () => () => <p className="member" />);

jest.mock('../ZoneGroupPlayState');
ZoneGroupPlayState.mockReturnValue(<p className="play-state" />);

describe('ZoneGroup', () => {
    let props;

    beforeEach(() => {
        props = {
            group: [
                {
                    member: 1,
                    coordinator: 'true',
                    host: 'myhost',
                },
            ],
            selectGroup: jest.fn(),
            showManagement: jest.fn(),
            playStates: {
                myhost: {
                    playing: true,
                },
            },
        };
    });

    it('matches snapshot', () => {
        const context = mount(<ZoneGroup {...props} />);
        expect(context).toMatchSnapshot();
        expect(context.find('.not-selected').length).toBe(1);
        expect(ZoneGroupPlayState).toHaveBeenCalled();

        const [lastCall] = ZoneGroupPlayState.mock.calls;
        expect(lastCall[0]).toMatchObject({
            playState: {
                playing: true,
            },
        });

        context.unmount();
    });

    it('matches snapshot when selected', () => {
        const currentHost = 'myhost';

        props = {
            ...props,
            currentHost,
        };

        const context = mount(<ZoneGroup {...props} />);
        expect(context).toMatchSnapshot();
        expect(context.find('.selected').length).toBe(1);
        context.unmount();
    });

    it('clicking whole group selects it', () => {
        const context = mount(<ZoneGroup {...props} />);
        context.find('.zone-group').simulate('click');
        expect(props.selectGroup).toHaveBeenCalled();
        context.unmount();
    });

    it('clicking button opens management', () => {
        const context = mount(<ZoneGroup {...props} />);

        context.find('.group-button').simulate('click', {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        });

        expect(props.showManagement).toHaveBeenCalled();
        context.unmount();
    });
});
