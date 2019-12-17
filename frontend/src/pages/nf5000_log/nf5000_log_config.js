/* eslint-disable import/prefer-default-export */
import { formatMessage } from 'umi/locale';

const LOG_MODULE = [
  {
    text: formatMessage({ id: 'log.syslog.module.policy' }),
    value: '转发策略',
  },
  {
    text: formatMessage({ id: 'log.syslog.module.policy.statistics' }),
    value: '接口统计',
  },
  {
    text: formatMessage({ id: 'log.syslog.module.business' }),
    value: '全局配置',
  },
  {
    text: formatMessage({ id: 'log.syslog.module.system.config' }),
    value: '系统配置',
  },
  {
    text: formatMessage({ id: 'log.syslog.module.log' }),
    value: '日志管理',
  },
];

const WARING_TYPES = [
  {
    text: formatMessage({ id: 'log.waringlog.waringType.cpu' }),
    value: '系统cpu/内存状态',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waringType.port' }),
    value: '端口UP/DOWN',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waringType.flow' }),
    value: '端口流量利用率阀值',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waringType.power' }),
    value: '电源故障',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waringType.fan' }),
    value: '风扇故障',
  },
];

const WARING_LEVELS = [
  {
    text: formatMessage({ id: 'log.waringlog.waring.emergencies' }),
    value: 'EMERGENCIES',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waring.alert' }),
    value: 'ALERT',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waring.critical' }),
    value: 'CRITICAL',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waring.error' }),
    value: 'ERROR',
  },
  {
    text: formatMessage({ id: 'log.waringlog.waring.warning' }),
    value: 'WARNING',
  },
];
export { LOG_MODULE, WARING_TYPES, WARING_LEVELS };
