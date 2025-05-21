delimiter ///
-- on transaction update, update the trade of upstream
create trigger update_on_transaction_renew after update on transaction for each row
    begin
        set new.date_updated = now();
        update trade set trade.date_updated = now() where trade_id = new.trade_id;
    end ///




delimiter ;