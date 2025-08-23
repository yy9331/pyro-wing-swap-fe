-- 1. 交易记录表
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id VARCHAR(42) NOT NULL,
  token_a VARCHAR(42) NOT NULL,
  token_b VARCHAR(42) NOT NULL,
  amount_a DECIMAL(65,18) NOT NULL,
  amount_b DECIMAL(65,18) NOT NULL,
  user_address VARCHAR(42) NOT NULL,
  tx_hash VARCHAR(66) NOT NULL UNIQUE,
  block_number BIGINT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. 池子信息表
CREATE TABLE pools (
  id VARCHAR(42) PRIMARY KEY,
  token_a VARCHAR(42) NOT NULL,
  token_b VARCHAR(42) NOT NULL,
  token_a_symbol VARCHAR(10) NOT NULL,
  token_b_symbol VARCHAR(10) NOT NULL,
  fee_tier INTEGER NOT NULL,
  total_value_locked_a DECIMAL(65,18) DEFAULT 0,
  total_value_locked_b DECIMAL(65,18) DEFAULT 0,
  volume_24h_a DECIMAL(65,18) DEFAULT 0,
  volume_24h_b DECIMAL(65,18) DEFAULT 0,
  last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. 用户交易历史表
CREATE TABLE user_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address VARCHAR(42) NOT NULL,
  trade_id UUID NOT NULL REFERENCES trades(id),
  pool_id VARCHAR(42) NOT NULL,
  trade_type VARCHAR(10) NOT NULL,
  amount_a DECIMAL(65,18) NOT NULL,
  amount_b DECIMAL(65,18) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. 创建索引
CREATE INDEX idx_trades_pool_timestamp ON trades(pool_id, timestamp);
CREATE INDEX idx_trades_timestamp ON trades(timestamp);
CREATE INDEX idx_trades_tx_hash ON trades(tx_hash);
CREATE INDEX idx_user_trades_user_address ON user_trades(user_address);
CREATE INDEX idx_user_trades_timestamp ON user_trades(timestamp);
CREATE INDEX idx_pools_last_updated ON pools(last_updated);


-- ========================================
-- 简化的 RLS 策略（适用于钱包登录）
-- ========================================

-- 1. 启用 RLS
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_trades ENABLE ROW LEVEL SECURITY;

-- 2. trades 表 - 完全公开（区块链数据）
CREATE POLICY "Allow public access to trades" ON trades
  FOR ALL USING (true);

-- 3. pools 表 - 完全公开（池子信息）
CREATE POLICY "Allow public access to pools" ON pools
  FOR ALL USING (true);

-- 4. user_trades 表 - 基于钱包地址过滤
CREATE POLICY "Allow users to access own trades" ON user_trades
  FOR ALL USING (true); -- 简化：允许所有访问，在应用层过滤

-- ========================================
-- 应用层安全控制
-- ========================================

-- 5. 创建函数来安全地插入交易
CREATE OR REPLACE FUNCTION insert_trade_safe(
  p_pool_id VARCHAR(42),
  p_token_a VARCHAR(42),
  p_token_b VARCHAR(42),
  p_amount_a DECIMAL(65,18),
  p_amount_b DECIMAL(65,18),
  p_user_address VARCHAR(42),
  p_tx_hash VARCHAR(66),
  p_block_number BIGINT
) RETURNS UUID AS $$
DECLARE
  trade_id UUID;
BEGIN
  -- 验证交易哈希唯一性
  IF EXISTS (SELECT 1 FROM trades WHERE tx_hash = p_tx_hash) THEN
    RAISE EXCEPTION 'Transaction hash already exists';
  END IF;
  
  -- 插入交易记录
  INSERT INTO trades (
    pool_id, token_a, token_b, amount_a, amount_b, 
    user_address, tx_hash, block_number
  ) VALUES (
    p_pool_id, p_token_a, p_token_b, p_amount_a, p_amount_b,
    p_user_address, p_tx_hash, p_block_number
  ) RETURNING id INTO trade_id;
  
  -- 插入用户交易记录
  INSERT INTO user_trades (
    user_address, trade_id, pool_id, trade_type, amount_a, amount_b
  ) VALUES (
    p_user_address, trade_id, p_pool_id, 'swap', p_amount_a, p_amount_b
  );
  
  RETURN trade_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 创建函数来获取用户交易历史
CREATE OR REPLACE FUNCTION get_user_trades(p_user_address VARCHAR(42))
RETURNS TABLE (
  id UUID,
  pool_id VARCHAR(42),
  trade_type VARCHAR(10),
  amount_a DECIMAL(65,18),
  amount_b DECIMAL(65,18),
  trade_timestamp TIMESTAMP,
  tx_hash VARCHAR(66)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ut.id,
    ut.pool_id,
    ut.trade_type,
    ut.amount_a,
    ut.amount_b,
    ut.timestamp as trade_timestamp,
    t.tx_hash
  FROM user_trades ut
  JOIN trades t ON ut.trade_id = t.id
  WHERE ut.user_address = p_user_address
  ORDER BY ut.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;