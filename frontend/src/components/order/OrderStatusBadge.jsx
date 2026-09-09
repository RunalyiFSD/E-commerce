import React from 'react';
import { ORDER_STATUS_CONFIG } from '../../constants/theme';
import Badge from '../common/Badge';

export function OrderStatusBadge({ status = 'PLACED', size = 'md', className }) {
  const config = ORDER_STATUS_CONFIG[status] || {
    label: status,
    variant: 'neutral',
  };

  return (
    <Badge
      variant={config.variant}
      size={size}
      showDot={['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PROCESSING'].includes(status)}
      className={className}
    >
      {config.label}
    </Badge>
  );
}

export default OrderStatusBadge;
