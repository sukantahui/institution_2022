<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionMasterResource;
use App\Models\CustomVoucher;
use App\Models\Ledger;
use App\Models\StudentCourseRegistration;
use App\Models\TransactionDetail;
use App\Models\TransactionMaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends ApiController
{

    public function get_all_transactions(){
        $transactions = TransactionMaster::get();
        return response()->json(['success'=>0,'data'=>TransactionMasterResource::collection($transactions)], 200,[],JSON_NUMERIC_CHECK);
    }
    //get fees charged transactions
    public function get_all_fees_charged_transactions(){
        $transactions = TransactionMaster::where('voucher_type_id',9)->get();
        return response()->json(['success'=>0,'data'=>TransactionMasterResource::collection($transactions)], 200,[],JSON_NUMERIC_CHECK);
    }

    public function get_total_dues_by_student_id($id){
        $debit = TransactionDetail::where('ledger_id',$id)->where('transaction_type_id',1)->sum('amount');
        $credit = TransactionDetail::where('ledger_id',$id)->where('transaction_type_id',2)->sum('amount');
        return response()->json(['success'=>0,'data'=>$debit-$credit], 200,[],JSON_NUMERIC_CHECK);
    }
    public function get_student_due_by_student_course_registration_id($id){
        //getting student course registration id
        try{
            $id =TransactionMaster::where('student_course_registration_id',2)->first()->id;
            $credit = TransactionDetail::where('transaction_master_id',1)->where('transaction_type_id',2)->sum('amount');

            $tm_ids=TransactionMaster::where('reference_transaction_master_id',$id)->get()->pluck('id');

            $debit=TransactionDetail::whereIn('transaction_master_id',$tm_ids)->where('transaction_type_id',1)->sum('amount');
        $total_due = $credit - $debit;
        return response()->json(['success'=>1,'data'=>$total_due], 200,[],JSON_NUMERIC_CHECK);
        }catch(\Exception $e){
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }
    }
    //testing
    //saving fees charging to student
    public function save_fees_charge(Request $request)
    {
        $input=($request->json()->all());

        $validator = Validator::make($input,[
            'transactionMaster' => 'required',
            'transactionDetails' => ['required',function($attribute, $value, $fail){
                $dr=0;
                $cr=0;

                foreach ($value as $v ){

                    /*
                     * This is a fees charging transaction, hence only a student can be debited
                     * */
                    if($v['transactionTypeId']==1){
                        $student = Ledger::find($v['ledgerId']);
                        if(!$student){
                            return $fail($v['ledgerId']." this ledger does not exist");
                        }
                        if($student->is_student==0){
                            return $fail("Only student can be Debited");
                        }
                    }
                    /*
                     * This is a fees charging transaction, hence only fees ca be credited
                     * */

                    if($v['transactionTypeId']==2){
                        $ledger = Ledger::find($v['ledgerId']);
                        if(!$ledger){
                            return $fail($v['ledgerId']." this ledger does not exist");
                        }
                        if($ledger->ledger_group_id!=6){
                            return $fail("This is not belongs to income ledger like fees");
                        }
                    }


                    if(!($v['transactionTypeId']==1 || $v['transactionTypeId']==2)){
                        return $fail("Transaction type id is incorrect");
                    }
                    if($v['transactionTypeId']==1){
                        $dr=$dr+$v['amount'];
                    }
                    if($v['transactionTypeId']==2){
                        $cr=$cr+$v['amount'];
                    }
                }

                if($dr!=$cr){
                    $fail("As per accounting rule Debit({$dr})  and Credit({$cr}) should be same");
                }


            }],
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        $input=($request->json()->all());
        $input_transaction_master=(object)($input['transactionMaster']);
        $input_transaction_details=($input['transactionDetails']);

        //validation
        $rules = array(
            'userId'=>'required|exists:users,id',
            'transactionDate' => 'bail|required|date_format:Y-m-d',
            'studentCourseRegistrationId' => ['bail','required',
                function($attribute, $value, $fail){
                    $StudentCourseRegistration=StudentCourseRegistration::where('id', $value)->where('is_completed','=',0)->first();
                    if(!$StudentCourseRegistration){
                        $fail($value.' is not a valid Course Registration Number');
                    }
                }],
        );
        $messages = array(
            'transactionDate.required'=>'Transaction Date is required',
            'transactionDate.date_format'=>'Date format should be yyyy-mm-dd',
        );

        $validator = Validator::make($input['transactionMaster'],$rules,$messages );


        if ($validator->fails()) {
            return response()->json(['position'=>1,'success'=>0,'data'=>null,'error'=>$validator->messages()], 406,[],JSON_NUMERIC_CHECK);
        }

        //details verification
        //validation
        $rules = array(
            "*.transactionTypeId"=>'required|in:1,2'
        );
        $validator = Validator::make($input['transactionDetails'],$rules,$messages );
        if ($validator->fails()) {
            return response()->json(['position'=>1,'success'=>0,'data'=>null,'error'=>$validator->messages()], 406,[],JSON_NUMERIC_CHECK);
        }
        DB::beginTransaction();
        try{
            $result_array=array();
            $accounting_year = get_accounting_year($input_transaction_master->transactionDate);
            $voucher="Fees Charged";
            $customVoucher=CustomVoucher::where('voucher_name','=',$voucher)->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                //already exist
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                //fresh entry
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name=$voucher;
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='FEES';
                $customVoucher->save();
            }
            //adding Zeros before number
            $counter = str_pad($customVoucher->last_counter,5,"0",STR_PAD_LEFT);

            //creating sale bill number
            $transaction_number = $customVoucher->prefix.'-'.$counter."-".$accounting_year;
            $result_array['transaction_number']=$transaction_number;

            //saving transaction master
            $transaction_master= new TransactionMaster();
            $transaction_master->voucher_type_id = 9; // 9 is the voucher_type_id in voucher_types table for Fees Charged Journal Voucher
            $transaction_master->transaction_number = $transaction_number;
            $transaction_master->transaction_date = $input_transaction_master->transactionDate;
            $transaction_master->student_course_registration_id = $input_transaction_master->studentCourseRegistrationId;
            $transaction_master->comment = $input_transaction_master->comment;
            $transaction_master->fees_year = $input_transaction_master->feesYear;
            $transaction_master->fees_month = $input_transaction_master->feesMonth;
            $transaction_master->save();
            $result_array['transaction_master']=$transaction_master;
            $transaction_details=array();
            foreach($input_transaction_details as $transaction_detail){
                $detail = (object)$transaction_detail;
                $td = new TransactionDetail();
                $td->transaction_master_id = $transaction_master->id;
                $td->ledger_id = $detail->ledgerId;
                $td->transaction_type_id = $detail->transactionTypeId;
                $td->amount = $detail->amount;
                $td->save();
                $transaction_details[]=$td;
            }
            $result_array['transaction_details']=$transaction_details;
            DB::commit();

        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>1,'data'=>new TransactionMasterResource($result_array['transaction_master'])], 200,[],JSON_NUMERIC_CHECK);
    }

    //monthly fees charged
    public function save_monthly_fees_charge(Request $request)
    {
        $input=($request->json()->all());
//        return $this->successResponse($TM->studentCourseRegistrationId);

        $validator = Validator::make($input,[
            'transactionMaster' => 'required',
            'transactionDetails' => ['required',function($attribute, $value, $fail){
                $dr=0;
                $cr=0;
                $monthly_fees_entry_count=0;
                foreach ($value as $v ){
                    if(!isset($v['ledgerId'])){
                        return $fail("Ledger Id is missing");
                    }
                    if(!isset($v['amount'])){
                        return $fail("Amount is missing");
                    }
                    if(!isset($v['transactionTypeId'])){
                        return $fail("Transaction type is missing");
                    }

                    if($v['ledgerId']==9 && $v['transactionTypeId']!=2){
                        return $fail("Cr. is only allowed for Monthly fees");
                    }
                    if($v['ledgerId']==9 && $v['transactionTypeId']==2){
                        $monthly_fees_entry_count++;
                    }
                    if($monthly_fees_entry_count>1){
                        return $fail("Monthly fees should be one");
                    }
                    /*
                     * This is a fees charging transaction, hence only a student can be debited
                     * */
                    if($v['transactionTypeId']==1){
                        $student = Ledger::find($v['ledgerId']);
                        if(!$student){
                            return $fail($v['ledgerId']." this ledger does not exist");
                        }
                        if($student->is_student==0){
                            return $fail("Only student can be Debited");
                        }
                    }
                    /*
                     * This is a fees charging transaction, hence only fees ca be credited
                     * */

                    if($v['transactionTypeId']==2){
                        $ledger = Ledger::find($v['ledgerId']);
                        if(!$ledger){
                            return $fail($v['ledgerId']." this ledger does not exist");
                        }
                        if($ledger->ledger_group_id!=6){
                            return $fail("This is not belongs to income ledger like fees");
                        }
                    }


                    if(!($v['transactionTypeId']==1 || $v['transactionTypeId']==2)){
                        return $fail("Transaction type id is incorrect");
                    }
                    if($v['amount'] && $v['transactionTypeId']==1){
                        $dr=$dr+$v['amount'];
                    }
                    if($v['amount'] && $v['transactionTypeId']==2){
                        $cr=$cr+$v['amount'];
                    }
                }

                if($dr!=$cr){
                    $fail("As per accounting rule Debit({$dr})  and Credit({$cr}) should be same");
                }


            }],
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        // now we have two essential elements transactionMaster and transactionDetails
        // we need to check their validity one by one
        $input=($request->json()->all());
        $input_transaction_master=(object)($input['transactionMaster']);
        $input_transaction_details=($input['transactionDetails']);


        //validation var transactionMaster
        $rules = array(
            'userId'=>'required|exists:users,id',
            'transactionDate' => 'bail|required|date_format:Y-m-d',
            'studentCourseRegistrationId' => ['bail','required',
                function($attribute, $value, $fail){
                    if(StudentCourseRegistration::find($value)->effective_date==null){
                        return $fail('You cant charge monthly fees without Effective Date');
                    }
                    $StudentCourseRegistration=StudentCourseRegistration::where('id', $value)->where('is_completed','=',0)->first();
                    if(!$StudentCourseRegistration){
                        return $fail($value.' is not a valid Course Registration Number');
                    }
                    $fees_mode_type_id=StudentCourseRegistration::find($value)->course->fees_mode_type->id;
                    if($fees_mode_type_id<>1){
                        return $fail("This is not monthly paid course");
                    }
                }],
        );
        $messages = array(
            'transactionDate.required'=>'Transaction Date is required',
            'transactionDate.date_format'=>'Date format should be yyyy-mm-dd',
        );

        $validator = Validator::make($input['transactionMaster'],$rules,$messages );


        if ($validator->fails()) {
            return response()->json(['position'=>1,'success'=>0,'data'=>null,'error'=>$validator->messages()], 406,[],JSON_NUMERIC_CHECK);
        }

        //details verification
        //validation
        $rules = array(
            "*.transactionTypeId"=>'required|in:1,2',
            "*.ledgerId"=>'exists:ledgers,id',
            "*.amount"=>'required'
        );
        $validator = Validator::make($input['transactionDetails'],$rules,$messages );
        if ($validator->fails()) {
            return response()->json(['position'=>1,'success'=>0,'data'=>null,'error'=>$validator->messages()], 406,[],JSON_NUMERIC_CHECK);
        }

        //calculating number of monthly fees charged for this SCR
        $monthly_fees_charged_count=TransactionMaster::whereHas('transaction_details',function($query){
            $query->where('ledger_id',9);
        })->where('student_course_registration_id',$input_transaction_master->studentCourseRegistrationId)->where('voucher_type_id',9)->count();


        //getting effective date, validation for effective date already done
        $effective_date = StudentCourseRegistration::find($input_transaction_master->studentCourseRegistrationId)->effective_date;

        //getting notional monthly fees charge
        $notional_monthly_fees_charge_count = StudentCourseRegistration::select(DB::raw("TIMESTAMPDIFF(MONTH, effective_date, CURDATE())+1 as notional_fees_charge"))
                                        ->where('id',$input_transaction_master->studentCourseRegistrationId)
                                        ->where('is_completed',0)
                                        ->where('is_started',1)
                                        ->first()->notional_fees_charge;

        if($monthly_fees_charged_count>$notional_monthly_fees_charge_count-1){
            return $this->errorResponse("Account Already up to date ",406);
        }
        if($monthly_fees_charged_count==0){
            $fees_month = (int)StudentCourseRegistration::select(DB::raw('month(effective_date) as current_month'))->where('id',9)->first()->current_month;
            $fees_year = (int)StudentCourseRegistration::select(DB::raw('year(effective_date) as current_year'))->where('id',9)->first()->current_year;
        }else{
            $LastMonthlyEntry = TransactionMaster::whereHas('transaction_details',function($query){
                $query->where('ledger_id',9);
            })->where('student_course_registration_id',$input_transaction_master->studentCourseRegistrationId)
                ->where('voucher_type_id',9)
                ->orderBy('fees_year', 'desc')
                ->orderBy('fees_month', 'desc')
                ->first();
            $fees_year = get_next_year((int)$LastMonthlyEntry->fees_year,(int)$LastMonthlyEntry->fees_month);
            $fees_month = get_next_month((int)$LastMonthlyEntry->fees_year,(int)$LastMonthlyEntry->fees_month);

        }
        DB::beginTransaction();
        try{
            $result_array=array();
            $accounting_year = get_accounting_year($input_transaction_master->transactionDate);
            $voucher="Fees Charged";
            $customVoucher=CustomVoucher::where('voucher_name','=',$voucher)->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                //already exist
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                //fresh entry
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name=$voucher;
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='FEES';
                $customVoucher->save();
            }
            //adding Zeros before number
            $counter = str_pad($customVoucher->last_counter,5,"0",STR_PAD_LEFT);

            //creating sale bill number
            $transaction_number = $customVoucher->prefix.'-'.$counter."-".$accounting_year;
            $result_array['transaction_number']=$transaction_number;

            //saving transaction master
            $transaction_master= new TransactionMaster();
            $transaction_master->voucher_type_id = 9; // 9 is the voucher_type_id in voucher_types table for Fees Charged Journal Voucher
            $transaction_master->transaction_number = $transaction_number;
            $transaction_master->transaction_date = $input_transaction_master->transactionDate;
            $transaction_master->student_course_registration_id = $input_transaction_master->studentCourseRegistrationId;
            $transaction_master->comment = $input_transaction_master->comment;
            $transaction_master->fees_year = $fees_year;
            $transaction_master->fees_month = $fees_month;
            $transaction_master->save();
            $result_array['transaction_master']=$transaction_master;
            $transaction_details=array();
            foreach($input_transaction_details as $transaction_detail){
                $detail = (object)$transaction_detail;
                $td = new TransactionDetail();
                $td->transaction_master_id = $transaction_master->id;
                $td->ledger_id = $detail->ledgerId;
                $td->transaction_type_id = $detail->transactionTypeId;
                $td->amount = $detail->amount;
                $td->save();
                $transaction_details[]=$td;
            }
            $result_array['transaction_details']=$transaction_details;
            DB::commit();

        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>1,'monthly_fees_charged_count'=>$monthly_fees_charged_count,'notional_monthly_fees_charge_count'=>$notional_monthly_fees_charge_count,'data'=>new TransactionMasterResource($result_array['transaction_master'])], 200,[],JSON_NUMERIC_CHECK);
    }

    //fees received
    public function save_fees_received(Request $request)
    {
        $input=($request->json()->all());

        $validator = Validator::make($input,[
            'transactionMaster' => 'required',
            'transactionDetails' => ['required',function($attribute, $value, $fail){
                $dr=0;
                $cr=0;
                foreach ($value as $v ){
                    //if transaction type id is incorrect
                    if(!($v['transactionTypeId']==1 || $v['transactionTypeId']==2)){
                        return $fail("Transaction type id is incorrect");
                    }

                    //checking debit and credit equality
                    if($v['transactionTypeId']==1){
                        $dr=$dr+$v['amount'];
                    }
                    if($v['transactionTypeId']==2){
                        $cr=$cr+$v['amount'];
                    }
                }
                //if debit and credit are not equal will through error
                if($dr!=$cr){
                    $fail("As per accounting rule Debit({$dr})  and Credit({$cr}) should be same");
                }
            }],
        ]);
        if($validator->fails()){
            return response()->json(['success'=>0,'data'=>null,'error'=>$validator->messages()], 200,[],JSON_NUMERIC_CHECK);
        }

        $input=($request->json()->all());
        $input_transaction_master=(object)($input['transactionMaster']);
        $input_transaction_details=($input['transactionDetails']);

        //validation for transaction master
        $rules = array(
            'userId'=>'required|exists:users,id',
            'transactionDate' => 'bail|required|date_format:Y-m-d',
            'referenceTransactionMasterId'=>['required','exists:transaction_masters,id',
                function($attribute, $value, $fail){
                    $TM = TransactionMaster::find($value);
                    if(!$TM){
                        return $fail($value.' no such transactions exists');
                    }
                    if($TM->voucher_type_id!=9){
                        return $fail($value.' this is not a Fees Entry');
                    }
                }]
        );
        $messages = array(
            'transactionDate.required'=>'Transaction Date is required',
            'transactionDate.date_format'=>'Date format should be yyyy-mm-dd',
        );

        $validator = Validator::make($input['transactionMaster'],$rules,$messages );


        if ($validator->fails()) {
            return response()->json(['position'=>1,'success'=>0,'data'=>null,'error'=>$validator->messages()], 406,[],JSON_NUMERIC_CHECK);
        }

        //details verification
        //validation
        $rules = array(
            "*.transactionTypeId"=>["required","in:1,2"]
        );
        $validator = Validator::make($input['transactionDetails'],$rules,$messages );
        if ($validator->fails()) {
            return response()->json(['position'=>1,'success'=>0,'data'=>null,'error'=>$validator->messages()], 406,[],JSON_NUMERIC_CHECK);
        }
        DB::beginTransaction();
        try{
            $result_array=array();
            $accounting_year = get_accounting_year($input_transaction_master->transactionDate);
            $voucher="Fees Received";
            $customVoucher=CustomVoucher::where('voucher_name','=',$voucher)->where('accounting_year',"=",$accounting_year)->first();
            if($customVoucher) {
                //already exist
                $customVoucher->last_counter = $customVoucher->last_counter + 1;
                $customVoucher->save();
            }else{
                //fresh entry
                $customVoucher= new CustomVoucher();
                $customVoucher->voucher_name=$voucher;
                $customVoucher->accounting_year= $accounting_year;
                $customVoucher->last_counter=1;
                $customVoucher->delimiter='-';
                $customVoucher->prefix='RPT';
                $customVoucher->save();
            }
            //adding Zeros before number
            $counter = str_pad($customVoucher->last_counter,5,"0",STR_PAD_LEFT);

            //creating sale bill number
            $transaction_number = $customVoucher->prefix.'-'.$counter."-".$accounting_year;
            $result_array['transaction_number']=$transaction_number;

            //saving transaction master
            $transaction_master= new TransactionMaster();
            $transaction_master->voucher_type_id = 4; // 4 is the voucher_type_id in voucher_types table for Receipt voucher
            $transaction_master->transaction_number = $transaction_number;
            $transaction_master->transaction_date = $input_transaction_master->transactionDate;

            $transaction_master->reference_transaction_master_id = $input_transaction_master->referenceTransactionMasterId;
            $transaction_master->comment = $input_transaction_master->comment;
            $transaction_master->save();
            $result_array['transaction_master']=$transaction_master;
            $transaction_details=array();
            foreach($input_transaction_details as $transaction_detail){
                $detail = (object)$transaction_detail;
                $td = new TransactionDetail();
                $td->transaction_master_id = $transaction_master->id;
                $td->ledger_id = $detail->ledgerId;
                $td->transaction_type_id = $detail->transactionTypeId;
                $td->amount = $detail->amount;
                $td->save();
                $transaction_details[]=$td;
            }
            $result_array['transaction_details']=$transaction_details;
            DB::commit();

        }catch(\Exception $e){
            DB::rollBack();
            return response()->json(['success'=>0,'exception'=>$e->getMessage()], 500);
        }

        return response()->json(['success'=>2,'data'=>new TransactionMasterResource($result_array['transaction_master'])], 200,[],JSON_NUMERIC_CHECK);
    }

    public function get_bill_details_by_id($id){
        $tm = TransactionMaster::find($id);
        $feesChargedTM = TransactionMaster::find($tm->reference_transaction_master_id);
        $feesCharged = TransactionDetail::where('transaction_master_id',$feesChargedTM->id)->where('transaction_type_id',2)->sum('amount');
        $feesPaid = TransactionDetail::where('transaction_master_id',$id)->where('transaction_type_id',2)->first();

        $feesPaidIds = TransactionMaster::where('reference_transaction_master_id',$tm->reference_transaction_master_id)->get()->pluck('id');
        $totalFeesPaid = TransactionDetail::whereIn('transaction_master_id',$feesPaidIds)->where('transaction_type_id',2)->sum('amount');

        $currentDues = $feesCharged - $totalFeesPaid;
        $studentDetails = Ledger::find($feesPaid->ledger_id);
        return response()->json(['success'=>1,
            'fessPaid'=>$totalFeesPaid,'due'=>$currentDues,'student'=>$studentDetails], 200,[],JSON_NUMERIC_CHECK);
    }
}
