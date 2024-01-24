use borsh::{BorshDeserialize, BorshSerialize};
use borsh_derive::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize)]
struct CounterAccount {
    pub counter: u32,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    msg!(&format!("Welcome to the counter program at {program_id}!"));

    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        msg!("Received account that is not owned by the program!");
        return Err(solana_program::program_error::ProgramError::IncorrectProgramId);
    }
    let mut counter_account = CounterAccount::try_from_slice(&account.data.borrow())?;
    counter_account.counter += 1;
    counter_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!(
        "Counter value: {}. Last greeted by {}",
        counter_account.counter,
        account.key
    );
    Ok(())
}
