/* eslint-disable */
import React, { Component } from 'react';
import T from 'prop-types';
import uuidv1 from 'uuid/v1';
import Swal from 'sweetalert2';
import Controls from '../Controls/Controls';
import Balance from '../Balance/Balance';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import storage from '../services/services';

export default class Dashboard extends Component {
  state = {
    transactions: [],
    balance: 0,
  };

  componentDidMount() {
    const accountData = storage.get('accountData');

    if (accountData) {
      this.setState({ ...accountData });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { transactions } = this.state;

    if (prevState.transactions !== transactions) {
      storage.save('accountData', this.state);
    }
  }

  handleDeposit = amount => {
    if (amount <= 0) {
      Swal.fire('Введите сумму для проведения операции!');
      return;
    }
    this.setState(({ transactions, balance }) => {
      const newStateTransaction = {
        id: uuidv1(),
        type: 'deposit',
        amount,
        date: new Date().toLocaleString(),
      };
      return {
        transactions: [...transactions, newStateTransaction],
        balance: balance + amount,
      };
    });
  };
  handleWithdraw = amount => {
    if (amount <= 0) {
      Swal.fire('Введите сумму для проведения операции!');
      return;
    }
    if (this.state.balance - amount < 0) {
      Swal.fire('На счету недостаточно средств для проведения операции!');
      return;
    }
    this.setState(({ transactions, balance }) => {
      const newStateTransaction = {
        id: uuidv1(),
        type: 'withdrawal',
        amount,
        date: new Date().toLocaleString(),
      };
      return {
        transactions: [...transactions, newStateTransaction],
        balance: balance - amount,
      };
    });
  };

  totalTransfers() {
    const { transactions } = this.state;
    return transactions.reduce(
      (acc, transaction) => {
        return {
          ...acc,
          [transaction.type]: acc[transaction.type] + transaction.amount,
        };
      },
      {
        deposit: 0,
        withdrawal: 0,
      },
    );
  }

  render() {
    const { transactions, balance } = this.state;
    const { deposit, withdrawal } = this.totalTransfers();
    return (
      <div className="dashboard">
        <Controls
          onDeposit={this.handleDeposit}
          onWithdraw={this.handleWithdraw}
        />
        <Balance
          balance={balance}
          income={Number(deposit)}
          expenses={Number(withdrawal)}
        />
        <TransactionHistory transactions={transactions} />
      </div>
    );
  }
}
